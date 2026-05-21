param(
    [string]$Message = "Auto-update $(Get-Date -Format 'yyyy-MM-dd HH:mm')",
    [switch]$SkipGit,
    [switch]$SkipDeploy
)

function Step {
    param([string]$Label, [ScriptBlock]$Block)
    Write-Host "`n==> $Label ..." -ForegroundColor Cyan
    & $Block
    if ($LASTEXITCODE -and $LASTEXITCODE -ne 0) {
        Write-Host "FAILED at: $Label" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "OK" -ForegroundColor Green
}

Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║            SEQUENTIAL TASK RUNNER                ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan

Step "Tracking competitors" { npm run competitors }

Step "Seeding radio programs" { npm run seed-radio }

if (-not $SkipGit) {
    Step "Staging all changes" { git add -A }
    Step "Committing" { git commit -m $Message }
    Step "Pushing to GitHub" { git push origin main }
}

if (-not $SkipDeploy) {
    Step "Deploying to Vercel (production)" { vercel --prod --yes }
    Write-Host "`nLive at: https://ezrafmonline.vercel.app" -ForegroundColor Yellow
}

Write-Host "`nDone!" -ForegroundColor Green
