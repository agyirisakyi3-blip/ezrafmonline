param(
    [switch]$SkipInstall,
    [switch]$SkipBuild
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

function CheckPrerequisite {
    param([string]$Command, [string]$Name)
    $exists = Get-Command $Command -ErrorAction SilentlyContinue
    if (-not $exists) {
        Write-Host "ERROR: $Name is not installed. Please install it first." -ForegroundColor Red
        exit 1
    }
    Write-Host "  Found $Name: $(& $Command --version)" -ForegroundColor Gray
}

Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║            EZRAFMONLINE SETUP PIPELINE           ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan

CheckPrerequisite "node" "Node.js"
CheckPrerequisite "npm" "npm"

if (-not $SkipInstall) {
    Step "Installing dependencies" { npm install }
}

Step "Generating Prisma client" { npx prisma generate }

Step "Pushing database schema" { npx prisma db push }

Step "Seeding database (users + categories)" { npm run seed }

Step "Seeding radio programs" { npm run seed-radio }

if (-not $SkipBuild) {
    Step "Building project" { npm run build }
}

Write-Host "`n╔══════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                 SETUP COMPLETE                  ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host "  Run 'npm run dev' to start the dev server.`n" -ForegroundColor Yellow
