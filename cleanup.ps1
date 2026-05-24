$content = Get-Content -Path "knip-files-new.txt" -Encoding utf8

$filesToDelete = @()

foreach ($line in $content) {
    $line = $line.Trim()
    
    # Parar de ler quando chegar na seção "Unused dependencies" ou afins
    if ($line -match "^Unused (dependencies|devDependencies|exports)") {
        break
    }
    
    if ($line -match "^src/.*" -or $line -match "^public/sw\.js" -or $line -match "eslint-cleanup\.config\.mjs") {
        # O knip as vezes adiciona espaços em branco no final
        $filePath = $line -replace '\s+$', ''
        
        if (Test-Path $filePath) {
            $filesToDelete += $filePath
        }
    }
}

foreach ($file in $filesToDelete) {
    Write-Host "Deletando $file..."
    Remove-Item -Path $file -Force
}

Write-Host "Limpeza concluída! $($filesToDelete.Length) arquivos removidos."
