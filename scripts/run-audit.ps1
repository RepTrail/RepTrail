$dir = "c:\Users\Marcos\Desktop\pra usar dps\5 - Trabalho\3 - Pessoais\RepTrail\web\src\components\store\advanced"
$reportPath = "c:\Users\Marcos\Desktop\pra usar dps\5 - Trabalho\3 - Pessoais\RepTrail\web\scripts\audit-layers-report.json"

$files = Get-ChildItem -Path $dir -Recurse -Include *.tsx, *.ts
$violations = @()
$highCount = 0
$mediumCount = 0
$lowCount = 0

foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        $lineNum = $i + 1
        
        if ($line -match 'className=') {
            $violations += @{ id = [guid]::NewGuid().ToString(); rule_id = "ADV-001"; severity = "HIGH"; layer = "advanced"; file = $file.Name; line = $lineNum; description = "Uso de className direto fora de base"; snippet = $line.Trim(); fixed = $false }
            $highCount++
        }
        if ($line -match 'style=\{') {
            $violations += @{ id = [guid]::NewGuid().ToString(); rule_id = "ADV-003"; severity = "HIGH"; layer = "advanced"; file = $file.Name; line = $lineNum; description = "Uso de style inline (proibido)"; snippet = $line.Trim(); fixed = $false }
            $highCount++
        }
        if ($line -match 'width=\{[0-9]+\}' -or $line -match 'height=\{[0-9]+\}' -or $line -match 'width="[0-9]+"' -or $line -match 'height="[0-9]+"') {
            $violations += @{ id = [guid]::NewGuid().ToString(); rule_id = "ADV-005"; severity = "LOW"; layer = "advanced"; file = $file.Name; line = $lineNum; description = "Uso de width ou height fixos numéricos"; snippet = $line.Trim(); fixed = $false }
            $lowCount++
        }
        if ($line -match '<RegistrySection' -or $line -match '<RegistryMain') {
            $violations += @{ id = [guid]::NewGuid().ToString(); rule_id = "ADV-007"; severity = "MEDIUM"; layer = "advanced"; file = $file.Name; line = $lineNum; description = "Renderiza RegistrySection ou RegistryMain dentro de si"; snippet = $line.Trim(); fixed = $false }
            $mediumCount++
        }
    }
}

$report = @{
    generated_at = (Get-Date).ToString("o")
    scope = "advanced"
    summary = @{
        total_violations = $violations.Count
        by_severity = @{
            HIGH = $highCount
            MEDIUM = $mediumCount
            LOW = $lowCount
        }
        by_layer = @{
            advanced = $violations.Count
        }
    }
    violations = $violations
}

$report | ConvertTo-Json -Depth 10 | Set-Content -Path $reportPath -Encoding UTF8
Write-Host "Audit complete. Found $($violations.Count) violations."
