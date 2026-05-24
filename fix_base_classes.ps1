$files = Get-ChildItem -Path "c:\Users\Marcos\Desktop\pra usar dps\5 - Trabalho\3 - Pessoais\RepTrail\web\src\components\store\base" -Filter "*.tsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # 1. Replace Omit<Props, 'className' | 'style'> & { className?: string, style?: React.CSSProperties }
    $content = [regex]::Replace($content, 'Omit<([A-Za-z]+Props), ''className'' \| ''style''> & \{ className\?: string, style\?: React\.CSSProperties \}', '$1')
    
    # 2. Replace Omit<Props, 'className' | 'style'> & { className?: string }
    $content = [regex]::Replace($content, 'Omit<([A-Za-z]+Props), ''className'' \| ''style''> & \{ className\?: string \}', '$1')
    
    Set-Content -Path $file.FullName -Value $content
}
