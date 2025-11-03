Write-Host "=== LOGIN ===" -ForegroundColor Cyan
$loginResp = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body (@{username='admin';password='password123'} | ConvertTo-Json) -ContentType 'application/json'
$token = $loginResp.data.token
Write-Host "Token: $($token.Substring(0,50))...`n"

$headers = @{'Authorization' = "Bearer $token"}

Write-Host "=== TEST /api/materials ===" -ForegroundColor Cyan
try {
    $r1 = Invoke-RestMethod -Uri 'http://localhost:8080/api/materials' -Method Get -Headers $headers
    Write-Host "OK - Count: $($r1.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "FAIL - $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`n=== TEST /api/requests ===" -ForegroundColor Cyan
try {
    $r2 = Invoke-RestMethod -Uri 'http://localhost:8080/api/requests' -Method Get -Headers $headers
    Write-Host "OK - Count: $($r2.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "FAIL - $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`n=== TEST /api/transactions ===" -ForegroundColor Cyan
try {
    $r3 = Invoke-RestMethod -Uri 'http://localhost:8080/api/transactions' -Method Get -Headers $headers
    Write-Host "OK - Count: $($r3.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "FAIL - $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}
