$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 5173
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
$listener.Start()
Write-Host "Serving $root on http://localhost:$port/"

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    $stream = $client.GetStream()
    $reader = [System.IO.StreamReader]::new($stream)
    $requestLine = $reader.ReadLine()
    if (-not $requestLine) {
      $client.Close()
      continue
    }
    while (($line = $reader.ReadLine()) -ne $null -and $line -ne "") { }

    $parts = $requestLine.Split(" ")
    $relative = if ($parts.Length -gt 1) { [Uri]::UnescapeDataString($parts[1].Split("?")[0].TrimStart('/')) } else { "index.html" }
    if ([string]::IsNullOrWhiteSpace($relative)) { $relative = "index.html" }
    $path = Join-Path $root $relative
    $resolved = [System.IO.Path]::GetFullPath($path)

    if (-not $resolved.StartsWith([System.IO.Path]::GetFullPath($root))) {
      $body = [Text.Encoding]::UTF8.GetBytes("403")
      $header = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 403 Forbidden`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n")
      $stream.Write($header, 0, $header.Length)
      $stream.Write($body, 0, $body.Length)
      $client.Close()
      continue
    }

    if (-not [System.IO.File]::Exists($resolved)) {
      $body = [Text.Encoding]::UTF8.GetBytes("404")
      $header = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 404 Not Found`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n")
      $stream.Write($header, 0, $header.Length)
      $stream.Write($body, 0, $body.Length)
      $client.Close()
      continue
    }

    $ext = [System.IO.Path]::GetExtension($resolved).ToLowerInvariant()
    $contentType = switch ($ext) {
      ".html" { "text/html; charset=utf-8" }
      ".css" { "text/css; charset=utf-8" }
      ".js" { "text/javascript; charset=utf-8" }
      ".jpg" { "image/jpeg" }
      ".jpeg" { "image/jpeg" }
      ".png" { "image/png" }
      default { "application/octet-stream" }
    }

    $bytes = [System.IO.File]::ReadAllBytes($resolved)
    $header = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n")
    $stream.Write($header, 0, $header.Length)
    $stream.Write($bytes, 0, $bytes.Length)
    $client.Close()
  }
}
finally {
  $listener.Stop()
}
