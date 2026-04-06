# One-click: start dev server + open browser when Next is ready (handles 3000 or 3001).
# Usage: powershell -ExecutionPolicy Bypass -File scripts\dev-and-open.ps1

$ErrorActionPreference = "SilentlyContinue"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Start-Process cmd.exe -ArgumentList @(
  "/k",
  "cd /d `"$projectRoot`" && title POM dev server && npm run dev"
) -WindowStyle Normal

$ports = @(3000, 3001)
$deadline = (Get-Date).AddMinutes(2)

while ((Get-Date) -lt $deadline) {
  foreach ($p in $ports) {
    try {
      $r = Invoke-WebRequest -Uri "http://127.0.0.1:$p/" -TimeoutSec 1 -UseBasicParsing
      if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) {
        Start-Process "http://127.0.0.1:$p/"
        exit 0
      }
    }
    catch {
      continue
    }
  }
  Start-Sleep -Milliseconds 400
}

Write-Host "Timeout: open the dev window and use the Local URL shown there." -ForegroundColor Yellow
Start-Process "http://127.0.0.1:3000/"
