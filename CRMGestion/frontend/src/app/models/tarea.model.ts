export class Tarea{
	id: number;
	id_tarea_template: number;
	titulo: string;
	descripcion: string;
	workflow_name: string;
	fecha_limite: Date;
	fecha_ejecucion: Date;
	urgente: boolean;
	falta_info: boolean;
	prioridad: string;
	id_cliente: number;
	id_servicio: number;
	id_asignado: number;
	estado: string;
	cliente: string;
	servicio: string;
	es_critica: boolean;
	ultimo_milestone: boolean;
	asignado: string;
	nombre_servicio: string;
	subtareas_totales: number;
	subtareas_completadas: number;
	titulo_ord: string;
	fecha_ejecucion_ord: Date;
	fecha_limite_ord: Date;
	fecha_limite_edit: Date;
	fecha_ejecucion_edit: Date;
	nombre_cliente: string;
	descripcionConvertidaHTML: any;
	id_depende_de: number;
	fecha_primera_reunion: any;
	id_tipo_tarea: number;
}
