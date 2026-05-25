import React from 'react';
import { Check } from 'lucide-react';
import { UploaderStatusCard } from './UploaderStatusCard';

export function PdfParsedStatus() {
    return (
        <UploaderStatusCard
            id="tour-parsed-status"
            icon={Check}
            label="Leitura Concluída"
            value="REVISE AS INFORMAÇÕES EXTRAÍDAS"
            isActive={true}
        />
    );
}

