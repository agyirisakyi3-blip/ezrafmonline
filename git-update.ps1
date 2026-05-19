param(
    [string]$Message = "Auto-update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

git add -A
if ($?) {
    git commit -m $Message
    if ($?) {
        git push origin main
        if ($?) {
            Write-Host "Done! Changes pushed to GitHub." -ForegroundColor Green
        }
    }
}
