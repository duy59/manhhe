# Test với Invoke-WebRequest thay vì Invoke-RestMethod

Write-Host "=== LOGIN ===" -ForegroundColor Cyan
$loginBody = @{username='admin'; password='password123'} | ConvertTo-Json

$loginResp = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json'
$token = $loginResp.data.token
Write-Host "Token: $($token.Substring(0,50))...`n" -ForegroundColor Green

# Test với WebRequest
Write-Host "=== TEST với Invoke-WebRequest ===" -ForegroundColor Cyan
$headers = @{
    'Authorization' = "Bearer $token"
    'Content-Type' = 'application/json'
}

Write-Host "`nTesting /api/materials..."
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/materials' -Method Get -Headers $headers
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✓ SUCCESS - Status: $($response.StatusCode) - Count: $($result.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "✗ FAILED - Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`nTesting /api/requests..."
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/requests' -Method Get -Headers $headers
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✓ SUCCESS - Status: $($response.StatusCode) - Count: $($result.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "✗ FAILED - Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`nTesting /api/transactions..."
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/transactions' -Method Get -Headers $headers
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✓ SUCCESS - Status: $($response.StatusCode) - Count: $($result.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "✗ FAILED - Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}
