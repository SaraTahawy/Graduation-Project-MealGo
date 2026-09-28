$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$certDir = Join-Path $projectRoot "certs"
$pfxPath = Join-Path $certDir "localhost-dev.pfx"
$password = ConvertTo-SecureString -String "mealgo-dev" -Force -AsPlainText

if (-not (Test-Path $certDir)) {
  New-Item -ItemType Directory -Path $certDir | Out-Null
}

$existing = Get-ChildItem Cert:\CurrentUser\My |
  Where-Object { $_.FriendlyName -eq "MealGo Dev HTTPS" } |
  Sort-Object NotAfter -Descending |
  Select-Object -First 1

if (-not $existing) {
  $existing = New-SelfSignedCertificate `
    -DnsName "localhost", "127.0.0.1" `
    -CertStoreLocation "Cert:\CurrentUser\My" `
    -FriendlyName "MealGo Dev HTTPS" `
    -KeyAlgorithm RSA `
    -KeyLength 2048 `
    -HashAlgorithm SHA256 `
    -NotAfter (Get-Date).AddYears(2)
}

Export-PfxCertificate `
  -Cert ("Cert:\CurrentUser\My\" + $existing.Thumbprint) `
  -FilePath $pfxPath `
  -Password $password | Out-Null

Write-Host "Dev HTTPS certificate exported to $pfxPath"
