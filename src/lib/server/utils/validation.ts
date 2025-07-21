// $lib/server/utils/validation.ts
import type { SKAIDataType } from "$lib/types/dtype";

export const validateRequestData = (data: FormData): SKAIDataType => {
	const raw = data.get('data');
	
	if (!raw || typeof raw !== 'string') {
		throw new Error("Data tidak valid.");
	}
	
	try {
		return JSON.parse(raw) as SKAIDataType;
	} catch (error) {
		throw new Error("Format data tidak valid.", { cause: error });
	}
};