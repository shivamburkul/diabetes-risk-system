# ============================================
# DIABETES FINAL PROJECT - START ALL SERVICES
# ============================================

Write-Host "Starting Diabetes Detection Project..." -ForegroundColor Green

# ---------- Lifestyle Backend ----------
Start-Process powershell `
  -ArgumentList "-NoProfile -Command cd 'lifestyle-check\backend'; python app.py"

Start-Sleep -Seconds 2

# ---------- Risk ML Backend ----------
Start-Process powershell `
  -ArgumentList "-NoProfile -Command cd 'risk-ml-engine\backend'; python app.py"

Start-Sleep -Seconds 2

# ---------- Lifestyle Frontend ----------
Start-Process powershell `
  -ArgumentList "-NoProfile -Command cd 'lifestyle-check\frontend'; npm run dev"

Start-Sleep -Seconds 2

# ---------- Risk ML Frontend ----------
Start-Process powershell `
  -ArgumentList "-NoProfile -Command cd 'risk-ml-engine\frontend'; npm run dev"

Start-Sleep -Seconds 3

# ---------- Open Assessment Hub Page ----------
Start-Process "assessment-hub\index.html"

Write-Host "----------------------------------------" -ForegroundColor DarkGray
Write-Host "All services started successfully!" -ForegroundColor Cyan
Write-Host "Assessment Hub opened in browser." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor DarkGray