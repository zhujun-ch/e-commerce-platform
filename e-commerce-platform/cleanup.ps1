$ErrorActionPreference = 'SilentlyContinue'
Get-Process | Where-Object { $_.Path -like '*node*' } | Stop-Process -Force
Start-Sleep -Seconds 3
Remove-Item -Recurse -Force 'F:\workshop\e-commerce-frontend'
if (Test-Path 'F:\workshop\e-commerce-frontend') {
    Write-Host 'still exists'
} else {
    Write-Host 'deleted'
}
