import { useState } from 'react';
import { useToast } from '@/components/store/hooks/use-toast';
import { actions, uploadPdf } from '@/lib/dal';
import { prepareCardios, prepareErgogenics } from '../lib/helpers';

export function usePdfUpload({ type, role, bindingHooks, selectionHooks }: any) {
    const [uploading, setUploading] = useState(false);
    const [parsing, setParsing] = useState(false);
    const [parsedData, setParsedData] = useState<any>(null);
    const { toast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await uploadPdf(filePath, file);
            if (uploadError) throw uploadError;

            toast({ title: "Arquivo enviado!", description: "Iniciando processamento com IA..." });
            setUploading(false);
            setParsing(true);

            const result = await actions.parseUploadedPdf(filePath, type);
            if (result.error) throw new Error(result.error);

            setParsedData(result.data);
            selectionHooks.setSelectedOptionIndex(0);

            if (result.data) {
                const cardios = result.data.parsed_data?.cardios || [];
                const ergogenics = result.data.parsed_data?.ergogenics || [];

                const { updatedCardios, initialCardios } = prepareCardios(cardios, role === 'student');
                if (updatedCardios.length > 0) result.data.parsed_data.cardios = updatedCardios;
                selectionHooks.setSelectedCardioIndices(initialCardios);

                const { updatedErgos, initialErgos } = prepareErgogenics(ergogenics);
                if (updatedErgos.length > 0) result.data.parsed_data.ergogenics = updatedErgos;
                selectionHooks.setSelectedErgoIndices(initialErgos);
            }

            if (role === 'trainer' && result.data?.detected_student_name) {
                bindingHooks.setDetectedStudentName(result.data.detected_student_name);
                // Sistema de auto-vÃ­nculo desativado a pedido do usuÃ¡rio
                bindingHooks.setStudentMatch(null);
                bindingHooks.setBindingMode('skip');
            } else {
                bindingHooks.setDetectedStudentName(null);
                bindingHooks.setStudentMatch(null);
                bindingHooks.setBindingMode('skip');
            }

            toast({ title: "Processamento concluÃ­do!", description: "Revise os dados antes de salvar." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Falha na importaÃ§Ã£o", description: error.message });
        } finally {
            setUploading(false);
            setParsing(false);
        }
    };

    return { uploading, parsing, parsedData, setParsedData, handleFileChange };
}
