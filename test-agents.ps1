# VendorAgent AI - Agent Testing Script
Write-Host "🤖 Testing VendorAgent AI Agents..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001/api/agents"

# Test 1: Agent Status
Write-Host "1️⃣ Testing Agent Status..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/status" -Method Get
    Write-Host "✅ Agent Status Retrieved" -ForegroundColor Green
    Write-Host "   Agents Running: $($response.agents.Count)" -ForegroundColor White
    foreach ($agent in $response.agents) {
        Write-Host "   - $($agent.name): $($agent.status)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: System Metrics
Write-Host "2️⃣ Testing System Metrics..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/metrics" -Method Get
    Write-Host "✅ Metrics Retrieved" -ForegroundColor Green
    Write-Host "   Total Agents: $($response.metrics.totalAgents)" -ForegroundColor White
    Write-Host "   Active: $($response.metrics.activeAgents)" -ForegroundColor White
    Write-Host "   Idle: $($response.metrics.idleAgents)" -ForegroundColor White
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Agent Messages
Write-Host "3️⃣ Testing Agent Communication..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/messages" -Method Get
    Write-Host "✅ Messages Retrieved" -ForegroundColor Green
    Write-Host "   Recent Messages: $($response.messages.Count)" -ForegroundColor White
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Growth Agent Messages
Write-Host "4️⃣ Testing Growth Agent Messages..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/growth/messages" -Method Get
    Write-Host "✅ Campaign Messages Retrieved" -ForegroundColor Green
    Write-Host "   Pending Approvals: $($response.count)" -ForegroundColor White
    if ($response.count -gt 0) {
        Write-Host "   Sample Message: $($response.messages[0].message)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Market Insights
Write-Host "5️⃣ Testing Market Agent Insights..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/market/insights" -Method Get
    Write-Host "✅ Market Insights Retrieved" -ForegroundColor Green
    Write-Host "   Total Insights: $($response.count)" -ForegroundColor White
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Multi-Agent Coordination
Write-Host "6️⃣ Testing Multi-Agent Coordination..." -ForegroundColor Yellow
try {
    $body = @{ scenario = "sales_drop" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/coordinate" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Coordination Triggered" -ForegroundColor Green
    Write-Host "   Scenario: $($response.scenario)" -ForegroundColor White
    Write-Host "   Messages Generated: $($response.messages.Count)" -ForegroundColor White
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "🎉 Testing Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Add GEMINI_API_KEY to server/.env" -ForegroundColor White
Write-Host "   2. Test image upload: curl -X POST $baseUrl/data/extract -F 'image=@image.jpg'" -ForegroundColor White
Write-Host "   3. Start frontend: npm run dev" -ForegroundColor White

# Made with Bob
