# PowerShell script to create a shareable zip of the Slide Changer app
$SourceDir = "dist\win-unpacked"
$ZipFile = "Slide_Changer_Shareable.zip"

if (Test-Path $ZipFile) {
    Remove-Item $ZipFile
}

Write-Host "Creating shareable zip file..." -ForegroundColor Cyan
Compress-Archive -Path "$SourceDir\*" -DestinationPath $ZipFile -Force

if (Test-Path $ZipFile) {
    Write-Host "Success! Shareable file created: $ZipFile" -ForegroundColor Green
} else {
    Write-Host "Failed to create zip file." -ForegroundColor Red
}
