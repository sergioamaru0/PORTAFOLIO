import certificadoStaffing from '../assets/certificatework/CartaLaboralStaffing.pdf';
import certificadoSerdan from '../assets/certificatework/CertificadoLaboralSerdan.pdf';
import certificadoServimax from '../assets/certificatework/certificado _laboral_servimax.pdf';
import cartaAlg from '../assets/certificatework/CARTA DE RECOMENDACIÓN SERGIO ANDRES BAREÑO CUBILLOS.pdf';

export type IsoMonth = `${number}-${number}`;

export interface Certificate {
	url: string;
	filename: string;
	label: string;
}

export interface ExperienceEntry {
	role: string;
	company: string;
	start: IsoMonth;
	end: IsoMonth;
	summary: string;
	certificate?: Certificate;
}

export const EXPERIENCE: ExperienceEntry[] = [
	{
		role: 'Desarrollador fullstack',
		company: 'Staffing',
		start: '2026-04',
		end: '2026-07',
		summary: 'Desarrollo fullstack con PHP y Phalcon en el backend y React con Next.js en el frontend, más ajustes de seguridad OWASP y BOLA.',
		certificate: {
			url: certificadoStaffing,
			filename: 'Certificado laboral - Staffing.pdf',
			label: 'certificado'
		}
	},
	{
		role: 'Desarrollador fullstack web',
		company: 'SERDAN',
		start: '2025-02',
		end: '2025-08',
		summary: 'Mis principales funciones en Serdán consistieron en el desarrollo, mantenimiento y mejora de módulos dentro de una plataforma web, utilizando tecnologías como PHP estructurado, Laravel y .NET C#, trabajando directamente en la optimización y ampliación de funcionalidades según las necesidades del cliente.',
		certificate: {
			url: certificadoSerdan,
			filename: 'Certificado laboral - SERDAN.pdf',
			label: 'certificado'
		}
	},
	{
		role: 'Desarrollador fullstack mobile',
		company: 'SERVIMAX Y CIA S.A.S',
		start: '2024-02',
		end: '2024-08',
		summary: 'mantenimiento, optimizacion y actualizacion de app (servimax conductores, servimax tenderos y servimax vendedor).',
		certificate: {
			url: certificadoServimax,
			filename: 'Certificado laboral - SERVIMAX Y CIA S.A.S.pdf',
			label: 'certificado'
		}
	},
	{
		role: 'Desarrollador fullstack web',
		company: 'ALG CREATION S.A.S',
		start: '2023-04',
		end: '2023-11',
		summary: 'Mis principales funciones consistieron en el desarrollo, mantenimiento y mejora de una plataforma web de streaming, específicamente destinada a la transmisión en vivo y servicios interactivos como tercero.',
		certificate: {
			url: cartaAlg,
			filename: 'Carta de recomendación - ALG CREATION S.A.S.pdf',
			label: 'certificado'
		}
	}
];

export function experienceYearsLabel(): string {
	const totalMonths = 4 + 7 + 7 + 8; // Staffing(4) + SERDAN(7) + SERVIMAX(7) + ALG(8) = 26

	if (totalMonths >= 24) {
		return '+ de 2 años';
	}
	if (totalMonths >= 12) {
		return '+ de 1 año';
	}
	return 'Menos de 1 año';
}
