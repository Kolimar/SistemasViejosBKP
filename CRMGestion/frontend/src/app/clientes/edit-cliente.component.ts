import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertServer } from '../global/index';
import { IMyOptions } from 'mydatepicker';
import { Servicio, Brief, Contacto, EmailContacto, TelefonoContacto, ServicioContratado, RolContacto, TipoTelefono, TipoEmpresa, MetodoFacturacion, TipoVenta, CanalAdquisicion, User, FormaPago, Landing, BriefPrimeraReunion } from '../models/index';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ClienteService, BriefService, BriefPrimeraReunionService } from '../services/index';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { Validaciones } from '../validaciones/index';
import { ModalDirective } from 'ng2-bootstrap';
import { FileUploadModule } from 'primeng/primeng';
import { ApiSettings } from '../global/index';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
    moduleId: module.id,
    selector: 'edit-cliente',
    templateUrl: './edit-cliente.html',
    providers: [AlertServer, ClienteService, BriefService, BriefPrimeraReunionService]
})

export class EditClienteComponent implements OnInit{
  selectedId: number;
  selectedName: string;
  dataCliente: any;
  dataBrief: BriefPrimeraReunion;
  fechaComienzoObjeto: Object= {};
  dataTiposVentas: string[]= [];
  dataCanalesAdquisicion: string[]= [];
  listLanding: Landing[]= [];
  idPmAsignado: string = '';
  idMetodoFacturacion: string= '';
  nombreEtapa: string= '';
  dataTiposEmpresas: string[]= [];
  estadoBrief: string;
  idFormaPago: string= '';
  cambioformulario: boolean= false;
  listRolesContacto: RolContacto[]= [];
  listTiposTelefonos: TipoTelefono[]= [];
  listTiposEmpresas: TipoEmpresa[]= [];
  listMetodosFacturacion: MetodoFacturacion[]= [];
  listServiciosContratados: Servicio[]= [];
  listTiposVenta: TipoVenta[]= [];
  listCanalesAdquicision: CanalAdquisicion[]= [];
  listPms: User[]= [];
  listFormasPago: FormaPago[]= [];
  isSubmitClientePrincipal: boolean= false;
  isSubmitClienteAdministracion: boolean= false;
  formClientePrincipal: FormGroup;
  formClienteAdministracion: FormGroup;
  formClienteVentas: FormGroup;
  formClienteCampanas: FormGroup;
  formClienteDiseno: FormGroup;
  formClienteDetalleEmpresa: FormGroup;
  formClientePM: FormGroup;
  nombreTipoTelefono: string;
  nombreRolContacto: string;
  indexModalEdicionContacto: number;
  loader: boolean= false;
  isSubmitClienteVentas: boolean = false;
  isSubmitClienteCampanas: boolean = false;
  isSubmitClienteDiseno: boolean = false;
  isSubmitClienteDetalleEmpresa: boolean = false;
  isSubmitClientePM: boolean = false;
  scoring: string= '';
  contratoFirmado: string = '';
  quienFactura: string = '';
  condicionIva: string = '';
  puntajeCliente: string = '';
  deleteContacto: Contacto;
  posicionEliminarContacto: number;
  deleteServicio: ServicioContratado;
  posicionEliminarServicio: number;
  fechaPrimeraReunionObjeto: Object = {};
  headerContacto: Contacto;
  editServicioContratado: ServicioContratado;
  fechaBajaObjeto: Object= {};
  esPrincipal: boolean;
  archivoAdjunto: any;
  urlUploadFile: string;
  existeContrato: boolean= false;
  urlDescargaContrato: any;
  estadoGuardado: boolean= true;
  calidadModeloNegocio: string;
  upselibilidad: string;
  educabilidad: string;
  conocimientoInternet: string;
  capacidadFinancieraCliente: string;
  nivelEsperadoHinchapelotes: string;

  //CREACION DE CONTACTO
  @ViewChild('modalCreateContacto') public modalCreateContacto:ModalDirective;
  formCreateContacto: FormGroup;
  formCreateEmailContacto: FormGroup;
  formCreateTelefonoContacto: FormGroup;
  formCreateRolContacto: FormGroup;
  modelModalContacto: Contacto;
  modelContacto: Contacto[]= [];
  isSubmitRolContacto: boolean= false;
  isSubmitEmailContacto: boolean = false;
  isSubmitTelefonoContacto: boolean = false;
  isSubmitContacto: boolean = false;
  curDate: boolean;

  // EDICION DE CONTACTO
  @ViewChild('modalEditContacto') public modalEditContacto:ModalDirective;
  formEditContacto: FormGroup;
  formEditEmailContacto: FormGroup;
  formEditTelefonoContacto: FormGroup;
  formEditRolContacto: FormGroup;

  // CREACION DE SERVICION
  @ViewChild('modalCreateServicio') public modalCreateServicio:ModalDirective;
  formCreateServicio: FormGroup;
  modelServicioContratado: ServicioContratado[]= [];
  isSubmitServicio: boolean = false;
  nombreServicioContratado: string;
  servicioRecurrente: boolean;

  //EDICION DE SERVICIO
  @ViewChild('modalEditServicio') public modalEditServicio:ModalDirective;
  formEditServicio: FormGroup;
  indexModalEdicionServicio: number;
  servicioRecurrenteEdit: boolean;

  // OPCIONES DE PLUGING DATEPICKER
  myDatePickerOptions: IMyOptions = {
      dateFormat: 'dd-mm-yyyy',
      editableDateField: false,
      disableWeekends: true,
      selectionTxtFontSize: '1.3rem',
      dayLabels: { su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa" },
      monthLabels: { 1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic" },
      todayBtnTxt: "Hoy",
      firstDayOfWeek: "mo",
      showInputField: true,
      openSelectorOnInputClick: true,
  }

  //OPCIONES DE MASK MONEY
  private numberMask = createNumberMask({
    prefix: '',
    suffix: '',
    thousandsSeparatorSymbol: '.'
  })

  public onlyNumberMask = createNumberMask({
    prefix: '',
    suffix: '',
    decimalSymbol: '',
    thousandsSeparatorSymbol: '',
    integerLimit: 11
  });

  constructor(
    private toastyService:ToastyService,
    private toastyConfig: ToastyConfig,
    private route: ActivatedRoute,
    private router: Router,
    private servicio: ClienteService,
    private servicioBrief: BriefService,
    private servicioBriefPrimeraReunion: BriefPrimeraReunionService,
    private fb: FormBuilder,
    private alert_server: AlertServer,
  ){

    // OPCIONES PREDETERMINADAS TASTY
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.timeout = 5000;
    this.toastyConfig.showClose = true;

    // CAPTURAR ID Y NOMBRE DE LISTADO DE BRIEFS SELECCIONADO
    this.selectedId = +this.route.snapshot.params['id'];
    this.selectedName = this.route.snapshot.params['name'];
    this.servicio.getCliente(this.selectedId).subscribe(
      data => {
        this.dataCliente= this.cargarDatosCliente(data.cliente);
        this.dataBrief= this.cargarDatosBrief(data.briefs);
        if (this.dataCliente) {

          this.cargarDatosTiposVentas(data.tiposVentas);
          this.cargarDatosTiposEmpresas(data.tiposEmpresas);
          this.cargarDatosCanalesAdquisicion(data.canalesAdquisicion);
          this.cargarDatosContactos(data.contactos, data.emailsContactos, data.telefonosContactos, data.rolesContactos);
          this.cargarDatosServicios(data.servicios);

          //INSTANCIAR FORMULARIO LUEGO DE LA CARGA DE DATOS
          this.createFormClientePrincipal();
          this.createFormClienteAdministracion();
          this.createFormClienteVentas();
          this.createFormClienteCampanas();
          this.createFormClienteDiseno();
          this.createFormClienteDetalleCliente();
          this.createFormClientePM();

          this.compareDates();
        }
      },
      error => {
        this.alert_server.messageError(error);
      }
    );

    // INSTANCIAR FORMULARIOS
    this.createContactoForm();
    this.createServicioForm();
    this.urlUploadFile= ApiSettings.urlApi+'subir-contrato/'+this.selectedId;
  }

  // CARGA DE DATOS DE BRIEF Y RETORNARLOS AL SUBSCRIBE
  cargarDatosCliente(data: any){
    for (let select of data){

      // TRANSFORMAR FECHA EN OBJETO PARA MOSTRAT EN DATEPICKER
      if (select.fecha_comienzo) {
        let fechaComienzoModel= new Date(select.fecha_comienzo);
        this.fechaComienzoObjeto = { date: { year: fechaComienzoModel.getUTCFullYear(), month: fechaComienzoModel.getUTCMonth() + 1, day: fechaComienzoModel.getUTCDate() } };
      }else{
        this.fechaComienzoObjeto= null;
      }

      // TRANSFORMAR FECHA EN OBJETO PARA MOSTRAT EN DATEPICKER
      if (select.fecha_primera_reunion) {
        let fechaPrimeraReunionModel= new Date(select.fecha_primera_reunion);
        this.fechaPrimeraReunionObjeto = { date: { year: fechaPrimeraReunionModel.getUTCFullYear(), month: fechaPrimeraReunionModel.getUTCMonth() + 1, day: fechaPrimeraReunionModel.getUTCDate() } };
      }else{
        this.fechaPrimeraReunionObjeto= null;
      }

      // TRANSFORMAR FECHA EN OBJETO PARA MOSTRAT EN DATEPICKER
      if (select.fecha_baja) {
        let fechaBajaModel= new Date(select.fecha_baja);
        this.fechaBajaObjeto = { date: { year: fechaBajaModel.getUTCFullYear(), month: fechaBajaModel.getUTCMonth() + 1, day: fechaBajaModel.getUTCDate() } };
      }else{
        this.fechaBajaObjeto= null;
      }

      // VERIFICAR PM ASIGNADO
      if (select.id_pm) {
        this.idPmAsignado= select.id_pm.toString();
      }else{
        this.idPmAsignado= '';
      }

      // VERIFICAR METODO FACTURACION
      if (select.id_metodo_facturacion) {
        this.idMetodoFacturacion= select.id_metodo_facturacion.toString();
      }else{
        this.idMetodoFacturacion= '';
      }

      // VERIFICAR METODO FACTURACION
      if (select.id_forma_pago) {
        this.idFormaPago= select.id_forma_pago.toString();
      }else{
        this.idFormaPago= '';
      }

      // VERIFICAR ETAPA
      if (select.etapa) {
        this.nombreEtapa= select.etapa.toString();
      }else{
        this.nombreEtapa= '';
      }

      // VERIFICAR SCORING
      if (select.scoring) {
        this.scoring= select.scoring.toString();
      }else{
        this.scoring= '';
      }

      // VERIFICAR QUIEN FACTURA
      if (select.quien_factura) {
        this.quienFactura= select.quien_factura.toString();
      }else{
        this.quienFactura= 'Nadie';
      }

      // VERIFICAR CONDICION IVA
      if (select.condicion_iva) {
        this.condicionIva= select.condicion_iva.toString();
      }else{
        this.condicionIva= '';
      }

      // VERIFICAR PUNTAJE CLIENTE
      if (select.puntaje_cliente) {
        this.puntajeCliente= select.puntaje_cliente.toString();
      }else{
        this.puntajeCliente= '';
      }

      // VERIFICAR CALIDAD DE MODELO DE NEGOCIO
      if (select.calidad_modelo_negocio) {
        this.calidadModeloNegocio= select.calidad_modelo_negocio.toString();
      }else{
        this.calidadModeloNegocio= '';
      }

      // VERIFICAR UPSELIBILIDAD
      if (select.upselibilidad) {
        this.upselibilidad= select.upselibilidad.toString();
      }else{
        this.upselibilidad= '';
      }

      // VERIFICAR EDUCABILIDAD
      if (select.educabilidad) {
        this.educabilidad= select.educabilidad.toString();
      }else{
        this.educabilidad= '';
      }

      // VERIFICAR NIVEL CONOCIMIENTO DE INTERNET
      if (select.conocimiento_internet) {
        this.conocimientoInternet= select.conocimiento_internet.toString();
      }else{
        this.conocimientoInternet= '';
      }

      // VERIFICAR CAPACIDAD FINANCIERA DE INTERNET
      if (select.capacidad_financiera_cliente) {
        this.capacidadFinancieraCliente= select.capacidad_financiera_cliente.toString();
      }else{
        this.capacidadFinancieraCliente= '';
      }

      // VERIFICAR NIVEL ESPERADO HINCHAPELOTES
      if (select.nivel_esperado_hinchapelotes) {
        this.nivelEsperadoHinchapelotes= select.nivel_esperado_hinchapelotes.toString();
      }else{
        this.nivelEsperadoHinchapelotes= '';
      }

      // VERIFICAR SI HAY CONTRATO FIRMADO
      if (select.url_contrato) {
        this.existeContrato= true;
        var nombreArchivo= select.url_contrato.replace("../public/", "");
        var url= ApiSettings.urlApi.replace("api/", "");
        this.urlDescargaContrato= url+nombreArchivo;
      }else{
        this.existeContrato= false;
      }
      this.estadoBrief= select.estado;
      this.dataCliente= select;

      return select;
    }
  }

  // CARGAR DATOS DEL BRIEFS DE PRIMERA REUNION
  cargarDatosBrief(data: BriefPrimeraReunion[]){
    for (let brief of data) {
        this.dataBrief= brief;
        return brief;
    }
  }

  //CARGAR DATOS DE TIPOS DE EMPRESAS
  cargarDatosTiposEmpresas(data: TipoEmpresa[]){
    for (let select of data) {
      // ["3","4"]
      let toString= select.id.toString();
      this.dataTiposEmpresas.push(toString);
    }
  }

  //CARGAR DATOS DE TIPOS DE VENTAS
  cargarDatosTiposVentas(data: TipoVenta[]){
    for (let select of data) {
      // ["3","4"]
      let toString= select.id.toString();
      this.dataTiposVentas.push(toString);
    }
  }

  //CARGAR DATOS DE CANAL DE ADQUISICION
  cargarDatosCanalesAdquisicion(data: CanalAdquisicion[]){
    for (let select of data) {
      // ["3","4"]
      let toString= select.id.toString();
      this.dataCanalesAdquisicion.push(toString);
    }
  }

  // CARGAR DATOS DE CONTACTO
  cargarDatosContactos(contacto: Contacto[], emails: EmailContacto[], telefonos: TelefonoContacto[], roles: RolContacto[]){
    for (let selectContacto of contacto) {
      this.modelModalContacto=new Contacto();
      this.modelModalContacto.id= selectContacto.id;
      this.modelModalContacto.nombre= selectContacto.nombre;
      this.modelModalContacto.apellido= selectContacto.apellido;
      this.modelModalContacto.religion_judia= selectContacto.religion_judia;
      this.modelModalContacto.medio_contacto= selectContacto.medio_contacto;
      this.modelModalContacto.comentario_contacto= selectContacto.comentarios;
      this.modelModalContacto.es_principal= selectContacto.es_principal;
      this.modelModalContacto.eliminado= selectContacto.eliminado;

      for (let selectRol of roles) {
        if (selectRol.id_contacto == this.modelModalContacto.id) {
          let model: any = {
            rol_contacto: selectRol.id,
            nombre_rol: selectRol.nombre,
          };
          this.modelModalContacto.roles.push(model);
        }
      }

      for (let selectEmail of emails) {
        if (selectEmail.id_contacto == this.modelModalContacto.id) {
          let model: any = {
            email: selectEmail.email,
          };
          this.modelModalContacto.emails.push(model);
        }
      }

      for (let selectTelefono of telefonos) {
        if (selectTelefono.id_contacto == this.modelModalContacto.id) {
          let model: any = {
            tipo_telefono: selectTelefono.id_tipo_telefono,
            telefono: selectTelefono.telefono,
            nombre_tipo_telefono: selectTelefono.nombre_tipo_telefono,
          };
          this.modelModalContacto.telefonos.push(model);
        }
      }
      this.modelContacto.push(this.modelModalContacto);
    }

    var arrayVerificar: boolean[]= [];
    for (let verificar of this.modelContacto) {
      if (verificar.es_principal == true && verificar.eliminado == false) {
        arrayVerificar.push(verificar.es_principal);
        this.headerContacto= verificar;
      }
    }

    if(arrayVerificar.length < 1){
      this.esPrincipal= false;
    }else{
      this.esPrincipal= true;
    }

  }

  // CARGAR DATOS DEL SERVICIOS
  cargarDatosServicios(data: ServicioContratado[]){
    for (let select of data) {
        this.modelServicioContratado.push(select);
    }
  }

  // CARGAR LISTADO DE ROLES
  loadPm(){
    this.servicioBrief.getListadoPms().subscribe(
      list => { this.listPms = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE ROLES
  loadRolesContactos(){
    this.servicioBrief.getListadoRolesContactos().subscribe(
      list => { this.listRolesContacto = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE TIPOS DE TELEFONOS
  loadTiposTelefonos(){
    this.servicioBrief.getListadoTiposTelefonos().subscribe(
      list => { this.listTiposTelefonos = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE TIPOS DE EMPRESA
  loadTiposEmpresas(){
    this.servicioBrief.getListadoTiposEmpresas().subscribe(
      list => { this.listTiposEmpresas = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE METODOS DE FATURACION
  loadMetodosFacturacion(){
    this.servicioBrief.getListadoMetodosFacturacion().subscribe(
      list => { this.listMetodosFacturacion = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE METODOS DE FATURACION
  loadTiposVentas(){
    this.servicioBrief.getListadoTiposVentas().subscribe(
      list => { this.listTiposVenta = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE CANALES DE ADQUISICION
  loadCanalesAdquisicion(){
    this.servicioBrief.getListadoCanalesAdquisicion().subscribe(
      list => { this.listCanalesAdquicision = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE CANALES DE ADQUISICION
  loadFormasPago(){
    this.servicio.getListadoFormasPago().subscribe(
      list => { this.listFormasPago = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE LANDINGS INTEGRACION CON SISTEMA DE GODIXITAL
  loadLandings(){
    let today = new Date();
    let timestamp = today.getTime();
    let hash= Md5.hashStr('GoDixitalFF'+timestamp);
    let model: any = {
      hash: hash,
      timestamp: timestamp,
      adwords_id: '896-625-1936'
    }
    this.servicio.getListadoLandings(model).subscribe(
      list => {
        this.listLanding= list[0].landings;
      },
      error => {
        this.alert_server.messageError(error);
      }
    );

  }

  // VERIFICAR SI LA FECHA DE BAJA ES IGUAL A LA FECHA ACTUAL
  compareDates(){
    if( (new Date(this.dataCliente.fecha_baja).getTime() <= new Date().getTime())){
      this.curDate= true;
    }else{
      this.curDate= false;
    }
  }

  // INICIAR
  ngOnInit(){
    this.loadPm();
    this.loadRolesContactos();
    this.loadTiposTelefonos();
    this.loadTiposEmpresas();
    this.loadServiciosContratados();
    this.loadMetodosFacturacion();
    this.loadTiposVentas();
    this.loadCanalesAdquisicion();
    this.loadFormasPago();
    this.loadLandings();
  }

  // CREAR FORMULARIO CLIENTE PRINCIPAL
  createFormClientePrincipal(){
    this.formClientePrincipal= this.fb.group({
      nombre: [this.dataCliente.nombre, Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validaciones.verificarEspacios,
      ])],
      pm_asignado: [this.dataCliente.id_pm, Validators.compose([
          Validators.required,
      ])],
      fecha_comienzo: [this.fechaComienzoObjeto, Validators.compose([
          Validators.required,
      ])],
      monto_abono: [this.dataCliente.monto_abono, Validators.compose([
          Validators.required,
      ])],
      scoring: this.scoring,
      fecha_primera_reunion: this.fechaPrimeraReunionObjeto,
      fecha_baja: this.fechaBajaObjeto,
      motivo_baja: [this.dataCliente.motivo_baja, Validators.compose([
          Validators.maxLength(50),
      ])],
    })
  }

  // CREAR FORMULARIO DE CONTACTO
  createContactoForm(){
    this.formCreateContacto= this.fb.group({
      nombre_contacto: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validaciones.verificarEspacios,
      ])],
      apellido_contacto: '',
      religion_judia: 0,
      medio_contacto: ['', Validators.compose([
          Validators.required,
          Validaciones.verificarEspacios,
      ])],
      comentarios_contactos: '',
      es_principal: 0,
    })

    this.formCreateRolContacto= this.fb.group({
      rol_contacto: ['', Validators.compose([
          Validators.required,
      ])],
    })

    this.formCreateEmailContacto= this.fb.group({
      email_contacto: ['', Validators.compose([
          Validators.required,
          Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
      ])],
    })

    this.formCreateTelefonoContacto= this.fb.group({
      tipo_telefono: ['', Validators.compose([
          Validators.required,
      ])],
      telefono_contacto: ['', Validators.compose([
          Validators.required,
      ])],
    })
  }

  // CREAR FORMULARIO DE SERVICIO
  createServicioForm(){
    this.formCreateServicio= this.fb.group({
      id_servicio: ['', Validators.compose([
          Validators.required,
      ])],
      cantidad_mensual: ['', Validators.compose([
          Validators.required,
      ])],
      fecha_comienzo: ['', Validators.compose([
          Validators.required,
      ])],
    })
  }

  // CREAR FORMULARIO CLIENTE ADMINISTRACION
  createFormClienteAdministracion(){
    this.formClienteAdministracion= this.fb.group({
      id_metodo_facturacion: [this.idMetodoFacturacion, Validators.compose([
          Validators.required,
      ])],
      contrato_firmado: [this.dataCliente.contrato_firmado, Validators.compose([
          Validators.required,
      ])],
      quien_factura: this.quienFactura,
      id_forma_pago: this.idFormaPago,
      condicion_iva: this.condicionIva,
      cuit: [this.dataCliente.cuit, Validators.compose([
          Validators.maxLength(11),
      ])],
      asunto_factura: [this.dataCliente.asunto_factura, Validators.compose([
          Validators.maxLength(50),
      ])],
      nombre_fiscal: [this.dataCliente.nombre_fiscal, Validators.compose([
          Validators.maxLength(50),
      ])],
      direccion_retiro_pago: [this.dataCliente.direccion_retiro_pago, Validators.compose([
          Validators.maxLength(80),
      ])],
      recibir_contrato_firmado: this.dataBrief.contrato_firmado
    })
  }

  // CREAR FORMULARIO CLIENTE VENTAS
  createFormClienteVentas(){
    this.formClienteVentas= this.fb.group({
      propuesta_original: [this.dataCliente.propuesta_original, Validators.compose([
          Validators.required,
      ])],
      id_canal_adquisicion: [this.dataCanalesAdquisicion, Validators.compose([
          Validators.required,
      ])],
      comentario_adquisicion: [this.dataCliente.comentario_adquisicion, Validators.compose([
          Validators.required,
      ])],
      puntaje_cliente: [this.puntajeCliente, Validators.compose([
          Validators.required,
          Validators.pattern(/^(?:10|[1-9])$/m),
      ])],
    })
  }

  // CREAR FORMULARIO CLIENTE CAMPAÑAS
  createFormClienteCampanas(){
    this.formClienteCampanas= this.fb.group({
      presupuesto_invertir_publicidad: [this.dataCliente.presupuesto_invertir_publicidad, Validators.compose([
          Validators.required,
      ])],
      distribucion_presupuesto_publicidad: this.dataCliente.distribucion_presupuesto_publicidad,
      objetivo_mensual: [this.dataCliente.objetivo_mensual, Validators.compose([
        Validators.pattern(/^([0-9]|[0-9][0-9]|[0-9][0-9][0-9]|[0-9][0-9][0-9][0-9]|[0-9][0][0][0][0])$/m),
      ])],
      expectativas_performance: this.dataBrief.expectativas_performance,
      estrategia_general: [this.dataBrief.estrategia_general, Validators.compose([
          Validators.required,
      ])],
      segmentacion_geografica: [this.dataBrief.segmentacion_geografica, Validators.compose([
          Validators.required,
      ])],
      presupuesto_adwords: [this.dataBrief.presupuesto_adwords, Validators.compose([
          Validators.required,
      ])],
      acceso_campana: this.dataBrief.acceso_campana,
      datos_facturacion: this.dataBrief.datos_facturacion,
      como_buscaria_cliente: this.dataBrief.como_buscaria_cliente,
      comentarios_remarketing: this.dataBrief.comentarios_remarketing,
      estrategia_facebook_ads: [this.dataBrief.estrategia_facebook_ads, Validators.compose([
          Validators.required,
      ])],
      datos_fan_page_ads: this.dataBrief.datos_fan_page_ads,
      datos_tdc: this.dataBrief.datos_tdc,
      presupuesto_facebook_ads: this.dataBrief.presupuesto_facebook_ads,
    })
  }

  // CREAR FORMULARIO CLIENTE DISEÑO
  createFormClienteDiseno(){
    this.formClienteDiseno= this.fb.group({
      sitio_web: [this.dataCliente.sitio_web, Validators.compose([
          Validators.maxLength(80),
      ])],
      fan_page: [this.dataCliente.fan_page, Validators.compose([
          Validators.maxLength(80),
      ])],
      pedir_datos_landing: this.dataBrief.pedir_datos_landing,
      estrategia_landing: [this.dataBrief.estrategia_landing, Validators.compose([
          Validators.required,
      ])],
      secciones_landing: this.dataBrief.secciones_landing,
      donde_hostear: this.dataBrief.donde_hostear,
      estrategia_facebook_posteos: [this.dataBrief.estrategia_facebook_posteos, Validators.compose([
          Validators.required,
      ])],
      datos_fan_page_posteos: this.dataBrief.datos_fan_page_posteos,
      estrategia_mailing: [this.dataBrief.estrategia_mailing, Validators.compose([
          Validators.required,
      ])],
      info_primeros_mailings: this.dataBrief.info_primeros_mailings,
    })
  }

  // CREAR FORMULARIO CLIENTE DETALLE EMPRESA
  createFormClienteDetalleCliente(){
    this.formClienteDetalleEmpresa= this.fb.group({
      id_tipo_empresa: [this.dataTiposEmpresas, Validators.compose([
          Validators.required,
          Validators.maxLength(80),
      ])],
      rubro: [this.dataCliente.rubro, Validators.compose([
          Validators.required,
      ])],
      id_tipo_venta: [this.dataTiposVentas, Validators.compose([
          Validators.required,
      ])],
      modelo_negocio: [this.dataCliente.modelo_negocio, Validators.compose([
          Validators.required,
      ])],
      calidad_modelo_negocio: [this.calidadModeloNegocio, Validators.compose([
          Validators.required,
      ])],
      acciones_realiza_internet: [this.dataCliente.acciones_realiza_internet, Validators.compose([
          Validators.required,
      ])],
      upselibilidad: [this.upselibilidad, Validators.compose([
          Validators.required,
      ])],
      comentario_upselibilidad: [this.dataCliente.comentario_upselibilidad, Validators.compose([
          Validators.required,
      ])],
      educabilidad: [this.educabilidad, Validators.compose([
          Validators.required,
      ])],
      comentario_educabilidad: [this.dataCliente.comentario_educabilidad, Validators.compose([
          Validators.required,
      ])],
      conocimiento_internet: [this.conocimientoInternet, Validators.compose([
          Validators.required,
      ])],
      capacidad_financiera_cliente: [this.capacidadFinancieraCliente, Validators.compose([
          Validators.required,
      ])],
      nivel_esperado_hinchapelotes: [this.nivelEsperadoHinchapelotes, Validators.compose([
          Validators.required,
      ])],
      competidores_cliente: [this.dataCliente.competidores_cliente, Validators.compose([
          Validators.required,
      ])],
      personalidad: [this.dataCliente.personalidad, Validators.compose([
          Validators.required,
      ])],
      modelo_negocio_brief: [this.dataBrief.modelo_negocio, Validators.compose([
          Validators.required,
      ])],
      relevo_ventas: this.dataBrief.relevo_ventas,
      puntos_conflictos: [this.dataBrief.puntos_conflictos, Validators.compose([
          Validators.required,
      ])],
    })
  }

  // CREAR FORMULARIO CLIENTE DISEÑO
  createFormClientePM(){
    this.formClientePM= this.fb.group({
      etapa: this.nombreEtapa,
      resumen_cliente: this.dataCliente.resumen_cliente,
    })
  }

  // CAPTURAR ROL EN EVENTO CHANGE
  capturarRolContacto(event: any){
    this.nombreRolContacto= event.target.selectedOptions[0].innerHTML;
  }

  // CAPTURAR TIPO DE TELEFONO
  capturarTipoTelefono(event: any){
    this.nombreTipoTelefono= event.target.selectedOptions[0].innerHTML;
  }

  // ABRIR MODAL DE CREACION CONTACTO
  showModalCreateContacto():void {
      this.modelModalContacto=new Contacto();
      this.modalCreateContacto.show();
      this.createContactoForm();
  }

  // CERRAR MODAL DE CREACION DE CONTACTO
  hideModalCreateContacto():void {
    this.modalCreateContacto.hide();
    this.isSubmitContacto= false;
    this.isSubmitRolContacto= false;
    this.isSubmitEmailContacto= false;
    this.isSubmitTelefonoContacto= false;
    this.modelModalContacto=null;
    this.formCreateContacto.reset({
      nombre_contacto: '',
      apellido_contacto: '',
      religion_judia: 0,
      medio_contacto: '',
      comentarios_contactos: '',
      es_principal: 0,
    });
    this.formCreateRolContacto.reset({
      rol_contacto: '',
    });
    this.formCreateEmailContacto.reset({
      email_contacto: '',
    });
    this.formCreateTelefonoContacto.reset({
      tipo_telefono: '',
      telefono_contacto: '',
    });
  }

  // AGREGAR ROLES DE CONTACTOS
  addRolesModalCreateContacto(){
    this.isSubmitRolContacto= true;
    if (this.formCreateRolContacto.valid && this.isSubmitRolContacto) {
      let model: any = {
        rol_contacto: this.formCreateRolContacto.get('rol_contacto').value,
        nombre_rol: this.nombreRolContacto,
      };
      this.modelModalContacto.roles.push(model);
      this.isSubmitRolContacto= false;
      this.formCreateRolContacto.reset({
        rol_contacto: '',
      });
    }else{
      this.formCreateRolContacto= this.fb.group({
        rol_contacto: [this.formCreateRolContacto.get('rol_contacto').value, Validators.compose([
            Validators.required,
        ])],
      })
    }
  }

  // ELIMINAR ROLES DE CONTACTOS
  deleteRolesModalCreateContacto(index: number){
    this.modelModalContacto.roles.splice(index, 1);
  }

  // AGREGAR EMAILS DE CONTACTOS
  addEmailModalCreateContacto(){
    this.isSubmitEmailContacto= true;
    if (this.formCreateEmailContacto.valid && this.isSubmitEmailContacto) {
      let model: any = {
        email: this.formCreateEmailContacto.get('email_contacto').value,
      };
      this.modelModalContacto.emails.push(model);
      this.isSubmitEmailContacto= false;
      this.formCreateEmailContacto.reset({
        email_contacto: '',
      });
    }else{
      this.formCreateEmailContacto= this.fb.group({
        email_contacto: [this.formCreateEmailContacto.get('email_contacto').value, Validators.compose([
            Validators.required,
            Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
        ])],
      })
    }
  }

  // EDITAR EMAILS DE CONTACTOS
  // editEmailModalCreateContacto(event:any, columna:string, index:number){
  //   if(columna == 'email'){
  //
  //     let newContent: string = event.target.innerHTML.trim();
  //     if (newContent.length < 1) {
  //       this.toastyService.error("El email es requerido");
  //     }else{
  //       this.modelModalContacto.emails[index].email = newContent;
  //     }
  //
  //   }
  // }

  // ELIMINAR EMAILS DE CONTACTOS
  deleteEmailModalCreateContacto(index: number){
    this.modelModalContacto.emails.splice(index, 1);
  }

  // AGREGAR TELEFONOS DE CONTACTOS
  addTelefonoModalCreateContacto(){
    this.isSubmitTelefonoContacto= true;
    if (this.formCreateTelefonoContacto.valid && this.isSubmitTelefonoContacto) {
      let model: any = {
        tipo_telefono: this.formCreateTelefonoContacto.get('tipo_telefono').value,
        telefono: this.formCreateTelefonoContacto.get('telefono_contacto').value,
        nombre_tipo_telefono: this.nombreTipoTelefono,
      };
      this.modelModalContacto.telefonos.push(model);
      this.isSubmitTelefonoContacto= false;
      this.formCreateTelefonoContacto.reset({
        tipo_telefono: '',
        telefono_contacto: '',
      });
    }else{
      this.formCreateTelefonoContacto= this.fb.group({
        tipo_telefono: [this.formCreateTelefonoContacto.get('tipo_telefono').value, Validators.compose([
            Validators.required,
        ])],
        telefono_contacto: [this.formCreateTelefonoContacto.get('telefono_contacto').value, Validators.compose([
            Validators.required,
        ])],
      })
    }
  }

  // CREAR CONTACTOS
  createContacto(){
    this.isSubmitContacto= true;

    if (this.modelModalContacto.roles.length < 1) {

      this.toastyService.error("Debe asignar al menos un rol al contacto");

    } else if(this.modelModalContacto.emails.length < 1){

      this.toastyService.error("Debe asignar al menos un email al contacto");

    }else if(this.modelModalContacto.telefonos.length < 1){

      this.toastyService.error("Debe asignar al menos un teléfono al contacto");

    }else{

      if (this.formCreateContacto.valid && this.isSubmitContacto) {
        let model : any = {
          nombre: this.formCreateContacto.get('nombre_contacto').value,
          apellido: this.formCreateContacto.get('apellido_contacto').value,
          nombre_rol: this.nombreRolContacto,
          religion_judia: this.formCreateContacto.get('religion_judia').value,
          medio_contacto: this.formCreateContacto.get('medio_contacto').value,
          comentarios_contactos: this.formCreateContacto.get('comentarios_contactos').value,
          es_principal: this.formCreateContacto.get('es_principal').value,
        }
        this.modelModalContacto.nombre= model.nombre;
        this.modelModalContacto.apellido= model.apellido;
        this.modelModalContacto.religion_judia= model.religion_judia;
        this.modelModalContacto.medio_contacto= model.medio_contacto;
        this.modelModalContacto.comentario_contacto= model.comentarios_contactos;
        this.modelModalContacto.es_principal= model.es_principal;

        var iArray= this.modelContacto.push(this.modelModalContacto);
        let arrayContactoConvert= JSON.stringify(this.modelContacto[iArray-1]);
        let modelArray: any = {
          arrayContacto: arrayContactoConvert,
          id_cliente: this.selectedId,
        }
        this.loader = true;
        this.servicio.addContacto(modelArray)
        .subscribe(
            data => {
              this.isSubmitContacto= false;
              this.formCreateContacto.reset({
                nombre_contacto: '',
                apellido_contacto: '',
                religion_judia: 0,
                medio_contacto: '',
                comentarios_contactos: '',
                es_principal: 0,
              });
              this.modelContacto= [];
              this.cargarDatosContactos(data.contactos, data.emailsContactos, data.telefonosContactos, data.rolesContactos);
              this.toastyService.success("El contacto fue creado exitosamente");
              this.loader = false;
              this.modalCreateContacto.hide();
            },
            error => {
              this.modelContacto.pop();
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formCreateContacto= this.fb.group({
          nombre_contacto: [this.formCreateContacto.get('nombre_contacto').value, Validators.compose([
              Validators.required,
              Validators.maxLength(50),
              Validaciones.verificarEspacios,
          ])],
          apellido_contacto: this.formCreateContacto.get('apellido_contacto').value,
          religion_judia: this.formCreateContacto.get('religion_judia').value,
          medio_contacto: [this.formCreateContacto.get('medio_contacto').value, Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
          ])],
          comentarios_contactos: this.formCreateContacto.get('comentarios_contactos').value,
          es_principal: this.formCreateContacto.get('es_principal').value,
        })
      }
    }
  }

  // EDICION DE CONTACTOS
  // ABRIR MODAL DE EDICION CONTACTO
  showModalEditContacto(index: number):void {
      this.modalEditContacto.show();
      this.indexModalEdicionContacto= index;
      this.formEditContacto= this.fb.group({
        nombre_contacto: [this.modelContacto[this.indexModalEdicionContacto].nombre, Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            Validaciones.verificarEspacios,
        ])],
        apellido_contacto: this.modelContacto[this.indexModalEdicionContacto].apellido,
        religion_judia: this.modelContacto[this.indexModalEdicionContacto].religion_judia,
        medio_contacto: [this.modelContacto[this.indexModalEdicionContacto].medio_contacto, Validators.compose([
            Validators.required,
            Validaciones.verificarEspacios,
        ])],
        comentarios_contactos: this.modelContacto[this.indexModalEdicionContacto].comentario_contacto,
        es_principal: this.modelContacto[this.indexModalEdicionContacto].es_principal,
      })

      this.formEditRolContacto= this.fb.group({
        rol_contacto: ['', Validators.compose([
            Validators.required,
        ])],
      })

      this.formEditEmailContacto= this.fb.group({
        email_contacto: ['', Validators.compose([
            Validators.required,
            Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
        ])],
      })

      this.formEditTelefonoContacto= this.fb.group({
        tipo_telefono: ['', Validators.compose([
            Validators.required,
        ])],
        telefono_contacto: ['', Validators.compose([
            Validators.required,
        ])],
      })
  }

  // CERRAR MODAL DE EDICION DE CONTACTO
  hideModalEditContacto():void {
    this.modalEditContacto.hide();
    this.isSubmitContacto= false;
    this.isSubmitRolContacto= false;
    this.isSubmitEmailContacto= false;
    this.isSubmitTelefonoContacto= false;
    this.formEditContacto.reset({
      nombre_contacto: '',
      apellido_contacto: '',
      religion_judia: 0,
      medio_contacto: '',
      comentarios_contactos: '',
      es_principal: 0,
    });
    this.formEditRolContacto.reset({
      rol_contacto: '',
    });
    this.formEditEmailContacto.reset({
      email_contacto: '',
    });
    this.formEditTelefonoContacto.reset({
      tipo_telefono: '',
      telefono_contacto: '',
    });
  }

  // AGREGAR ROLES DE CONTACTOS
  addRolesModalEditContacto(){
    this.isSubmitRolContacto= true;
    if (this.formEditRolContacto.valid && this.isSubmitRolContacto) {
      let model: any = {
        rol_contacto: this.formEditRolContacto.get('rol_contacto').value,
        nombre_rol: this.nombreRolContacto,
      };
      this.modelContacto[this.indexModalEdicionContacto].roles.push(model);
      this.isSubmitRolContacto= false;
      this.formEditRolContacto.reset({
        rol_contacto: '',
      });
    }else{
      this.formEditRolContacto= this.fb.group({
        rol_contacto: [this.formEditRolContacto.get('rol_contacto').value, Validators.compose([
            Validators.required,
        ])],
      })
    }
  }

  // ELIMINAR ROLES DE CONTACTOS
  deleteRolesModalEditContacto(index: number){
    this.modelContacto[this.indexModalEdicionContacto].roles.splice(index, 1);
  }

  // AGREGAR EMAILS DE CONTACTOS
  addEmailModalEditContacto(){
    this.isSubmitEmailContacto= true;
    if (this.formEditEmailContacto.valid && this.isSubmitEmailContacto) {
      let model: any = {
        email: this.formEditEmailContacto.get('email_contacto').value,
      };
      this.modelContacto[this.indexModalEdicionContacto].emails.push(model);
      this.isSubmitEmailContacto= false;
      this.formEditEmailContacto.reset({
        email_contacto: '',
      });
    }else{
      this.formEditEmailContacto= this.fb.group({
        email_contacto: [this.formEditEmailContacto.get('email_contacto').value, Validators.compose([
            Validators.required,
            Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
        ])],
      })
    }
  }

  // EDITAR EMAILS DE CONTACTOS
  // editEmailModalEditContacto(event:any, columna:string, index:number){
  //   if(columna == 'email'){
  //
  //     let newContent: string = event.target.innerHTML.trim();
  //     if (newContent.length < 1) {
  //       this.toastyService.error("El email es requerido");
  //     }else{
  //       this.modelContacto[this.indexModalEdicionContacto].emails[index].email = newContent;
  //     }
  //
  //   }
  // }

  // ELIMINAR EMAILS DE CONTACTOS
  deleteEmailModalEditContacto(index: number){
    this.modelContacto[this.indexModalEdicionContacto].emails.splice(index, 1);
  }

  // AGREGAR TELEFONOS DE CONTACTOS
  addTelefonoModalEditContacto(){
    this.isSubmitTelefonoContacto= true;
    if (this.formEditTelefonoContacto.valid && this.isSubmitTelefonoContacto) {
      let model: any = {
        tipo_telefono: this.formEditTelefonoContacto.get('tipo_telefono').value,
        telefono: this.formEditTelefonoContacto.get('telefono_contacto').value,
        nombre_tipo_telefono: this.nombreTipoTelefono,
      };
      this.modelContacto[this.indexModalEdicionContacto].telefonos.push(model);
      this.isSubmitTelefonoContacto= false;
      this.formEditTelefonoContacto.reset({
        tipo_telefono: '',
        telefono_contacto: '',
      });
    }else{
      this.formEditTelefonoContacto= this.fb.group({
        tipo_telefono: [this.formEditTelefonoContacto.get('descripcion_telefono').value, Validators.compose([
            Validators.required,
        ])],
        telefono_contacto: [this.formEditTelefonoContacto.get('telefono_contacto').value, Validators.compose([
            Validators.required,
        ])],
      })
    }
  }

  // EDITAR EMAILS DE CONTACTOS
  // editTelefonoModalEditContacto(event:any, columna:string, index:number){
  //
  //   if(columna == 'telefono'){
  //
  //     let newContent: string = event.target.innerHTML.trim();
  //     if (newContent.length < 1) {
  //       this.toastyService.error("El teléfono es requerido");
  //     }else{
  //       this.modelContacto[this.indexModalEdicionContacto].telefonos[index].telefono = newContent;
  //     }
  //
  //   }
  //
  // }

  // ELIMINAR EMAILS DE CONTACTOS
  deleteTelefonoModalEditContacto(index: number){
    this.modelContacto[this.indexModalEdicionContacto].telefonos.splice(index, 1);
  }

  //  EDITAR CONTACTO
  editContacto(){
    this.isSubmitContacto= true;
    if (this.modelContacto[this.indexModalEdicionContacto].roles.length < 1) {

      this.toastyService.error("Debe asignar al menos un rol al contacto");

    }else if (this.modelContacto[this.indexModalEdicionContacto].emails.length < 1) {

      this.toastyService.error("Debe asignar al menos un email al contacto");

    } else if(this.modelContacto[this.indexModalEdicionContacto].telefonos.length < 1){

      this.toastyService.error("Debe asignar al menos un teléfono al contacto");

    }else{

      if (this.formEditContacto.valid && this.isSubmitContacto) {
        let model : any = {
          nombre: this.formEditContacto.get('nombre_contacto').value,
          apellido: this.formEditContacto.get('apellido_contacto').value,
          nombre_rol: this.nombreRolContacto,
          religion_judia: this.formEditContacto.get('religion_judia').value,
          medio_contacto: this.formEditContacto.get('medio_contacto').value,
          comentarios_contactos: this.formEditContacto.get('comentarios_contactos').value,
          es_principal: this.formEditContacto.get('es_principal').value,
        }
        this.modelContacto[this.indexModalEdicionContacto].nombre= model.nombre;
        this.modelContacto[this.indexModalEdicionContacto].apellido= model.apellido;
        this.modelContacto[this.indexModalEdicionContacto].nombre_rol= model.nombre_rol;
        this.modelContacto[this.indexModalEdicionContacto].religion_judia= model.religion_judia;
        this.modelContacto[this.indexModalEdicionContacto].medio_contacto= model.medio_contacto;
        this.modelContacto[this.indexModalEdicionContacto].comentario_contacto= model.comentarios_contactos;
        this.modelContacto[this.indexModalEdicionContacto].es_principal= model.es_principal;
        let arrayContactoConvert= JSON.stringify(this.modelContacto[this.indexModalEdicionContacto]);
        let modelArray: any = {
          arrayContacto: arrayContactoConvert,
        }
        this.loader = true;
        this.servicio.editContacto(modelArray, this.selectedId)
        .subscribe(
            data => {
              this.isSubmitContacto= false;
              this.formEditContacto.reset({
                nombre_contacto: '',
                apellido_contacto: '',
                religion_judia: 0,
                medio_contacto: '',
                comentarios_contactos: '',
                es_principal: 0,
              });
              this.modelContacto= [];
              this.cargarDatosContactos(data.contactos, data.emailsContactos, data.telefonosContactos, data.rolesContactos);
              this.toastyService.info("El contacto fue editado exitosamente");
              this.loader = false;
              this.modalEditContacto.hide();
            },
            error => {
              this.modelContacto.pop();
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formEditContacto= this.fb.group({
          nombre_contacto: [this.formEditContacto.get('nombre_contacto').value, Validators.compose([
              Validators.required,
              Validators.maxLength(50),
              Validaciones.verificarEspacios,
          ])],
          apellido_contacto: this.formEditContacto.get('apellido_contacto').value,
          religion_judia: this.formEditContacto.get('religion_judia').value,
          medio_contacto: [this.formEditContacto.get('medio_contacto').value, Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
          ])],
          comentarios_contactos: this.formEditContacto.get('comentarios_contactos').value,
          es_principal: this.formEditContacto.get('es_principal').value,
        })
      }
    }
  }

  onDeleteContacto(contacto: Contacto, index: number){
    this.deleteContacto= contacto;
    this.posicionEliminarContacto= index;
  }

  //ELIMINAR EL CONTACTO
  deleteContactoBrief(){
    this.loader= true;
    this.servicio.deleteContacto(this.deleteContacto.id)
    .subscribe(
        data => {
          $('#eliminar-contacto').modal('hide');
          this.modelContacto.splice(this.posicionEliminarContacto, 1);
          this.loader= false;
          this.toastyService.error("El contacto fue eliminado exitosamente");
        },
        error => {
          this.alert_server.messageError(error);
          this.loader= false;
        }
    );
  }

  // SERVICIOS
  // ABRIR MODAL DE CREACION DE SERVICIO
  showModalCreateServicio():void {
      this.modalCreateServicio.show();
      this.createServicioForm();
  }

  // CERRAR MODAL DE CREACION DE CONTACTO
  hideModalCreateServicio():void {
      this.modalCreateServicio.hide();
      this.isSubmitServicio= false;
      this.servicioRecurrente= false;
      this.formCreateServicio.reset({
        id_servicio: '',
        cantidad_mensual: '',
        fecha_comienzo: '',
      });
  }

  // CARGAR LISTADO DE SERVICIOS
  loadServiciosContratados(){
    this.servicioBrief.getListadoServicios().subscribe(
      list => {
        this.listServiciosContratados = list;
      },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CAPTURAR DATOS DE SERVICIO CONTRATADO CREACION
  capturarServicioContratadoCreate(event: any, id: number){
    this.nombreServicioContratado= event.target.selectedOptions[0].innerHTML;

    for (let selectServicio of this.listServiciosContratados) {
        if (selectServicio.id == id) {
          this.servicioRecurrente= selectServicio.es_recurrente;
        };
    }
  }

  // CREAR SERVICIO
  createServicio(){
    this.isSubmitServicio= true;

    if (this.formCreateServicio.get('fecha_comienzo').value) {
      var fecha_comienzo: any = [this.formCreateServicio.get('fecha_comienzo').value.date.year, this.formCreateServicio.get('fecha_comienzo').value.date.month, this.formCreateServicio.get('fecha_comienzo').value.date.day].join('-');
    }else{
      var fecha_comienzo= this.formCreateServicio.get('fecha_comienzo').value;
    }

    if (this.servicioRecurrente) {

      if (this.formCreateServicio.valid && this.isSubmitServicio) {
        let model : any = {
          cantidad_mensual: this.formCreateServicio.get('cantidad_mensual').value,
          id_servicio: this.formCreateServicio.get('id_servicio').value,
          nombre_servicio: this.nombreServicioContratado,
          es_recurrente: true,
          id_cliente: this.selectedId,
          fecha_comienzo: fecha_comienzo,
        };
        this.loader = true;
        this.servicio.addServicio(model)
        .subscribe(
            data => {
              this.modelServicioContratado= [];
              this.cargarDatosServicios(data);
              this.isSubmitServicio= false;
              this.servicioRecurrente= false;
              this.formCreateServicio.reset({
                id_servicio: '',
                cantidad_mensual: '',
              });
              this.toastyService.success("El servicio fue creado exitosamente");
              this.loader = false;
              this.modalCreateServicio.hide();
            },
            error => {
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formCreateServicio= this.fb.group({
          id_servicio: [this.formCreateServicio.get('id_servicio').value, Validators.compose([
              Validators.required,
          ])],
          cantidad_mensual: [this.formCreateServicio.get('cantidad_mensual').value, Validators.compose([
              Validators.required,
          ])],
          fecha_comienzo: [this.formCreateServicio.get('fecha_comienzo').value, Validators.compose([
              Validators.required,
          ])],
        })
      }

    }else{

      if (this.formCreateServicio.get('id_servicio').valid && this.isSubmitServicio) {
        let model : any = {
          cantidad_mensual: null,
          id_servicio: this.formCreateServicio.get('id_servicio').value,
          nombre_servicio: this.nombreServicioContratado,
          es_recurrente: false,
          id_cliente: this.selectedId,
          fecha_comienzo: fecha_comienzo,
        };
        this.loader = true;
        this.servicio.addServicio(model)
        .subscribe(
            data => {
              this.modelServicioContratado= [];
              this.cargarDatosServicios(data);
              this.isSubmitServicio= false;
              this.servicioRecurrente= false;
              this.formCreateServicio.reset({
                id_servicio: '',
                cantidad_mensual: '',
              });
              this.toastyService.success("El servicio fue creado exitosamente");
              this.loader = false;
              this.modalCreateServicio.hide();
            },
            error => {
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formCreateServicio= this.fb.group({
          id_servicio: [this.formCreateServicio.get('id_servicio').value, Validators.compose([
              Validators.required,
          ])],
          cantidad_mensual: '',
          fecha_comienzo: [this.formCreateServicio.get('fecha_comienzo').value, Validators.compose([
              Validators.required,
          ])],
        })
      }

    }

  }

  // ABRIR MODAL DE EDICION DE SERVICIO
  showModalEditServicio(servicio: ServicioContratado, index: number):void {
      this.editServicioContratado= servicio;
      this.modalEditServicio.show();
      this.indexModalEdicionServicio= index;

      this.servicioRecurrenteEdit= this.modelServicioContratado[index].es_recurrente;
      let fechaModel= new Date(this.modelServicioContratado[index].fecha_comienzo);
      var fechaComienzoObjeto = { date: { year: fechaModel.getUTCFullYear(), month: fechaModel.getUTCMonth() + 1, day: fechaModel.getUTCDate() } };

      this.formEditServicio= this.fb.group({
        cantidad_mensual: [this.modelServicioContratado[index].cantidad_mensual, Validators.compose([
            Validators.required,
        ])],
      })

  }

  // CAPTURAR DATOS DE SERVICIO CONTRATADO EDICION
  capturarServicioContratadoEdit(event: any, id: number){
    this.nombreServicioContratado= event.target.selectedOptions[0].innerHTML;

    for (let selectServicio of this.listServiciosContratados) {
        if (selectServicio.id == id) {
          this.servicioRecurrenteEdit= selectServicio.es_recurrente;
        };
    }
  }

  // CERRAR MODAL DE CREACION DE CONTACTO
  hideModalEditServicio():void {
      this.modalEditServicio.hide();
      this.isSubmitServicio= false;
      this.servicioRecurrenteEdit= false;
      this.formEditServicio.reset({
        cantidad_mensual: '',
      });
  }

  // EDITAR SERVICIO
  editServicio(){
    this.isSubmitServicio= true;

    if (this.servicioRecurrenteEdit) {

      if(this.formEditServicio.valid && this.isSubmitServicio){

        let model : any = {
          cantidad_mensual: this.formEditServicio.get('cantidad_mensual').value,
        };
        this.modelServicioContratado[this.indexModalEdicionServicio].cantidad_mensual= model.cantidad_mensual;

        let arrayServicio= JSON.stringify(this.modelServicioContratado[this.indexModalEdicionServicio]);
        let modelArray: any = {
          arrayServicio: arrayServicio,
        }
        this.loader = true;
        this.servicio.editServicio(modelArray, this.selectedId)
        .subscribe(
            data => {
              this.modelServicioContratado= [];
              this.cargarDatosServicios(data);
              this.isSubmitServicio= false;
              this.servicioRecurrenteEdit= false;
              this.formEditServicio.reset({
                cantidad_mensual: '',
              });
              this.toastyService.info("El servicio fue editado exitosamente");
              this.loader = false;
              this.modalEditServicio.hide();
            },
            error => {
              this.modelServicioContratado.pop();
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formEditServicio= this.fb.group({
          cantidad_mensual: [this.formEditServicio.get('cantidad_mensual').value, Validators.compose([
              Validators.required,
          ])],
        })
      }

    }else{

      if(this.formEditServicio.get('id_servicio').valid && this.isSubmitServicio){

        let model : any = {
          cantidad_mensual: null,
        };
        this.modelServicioContratado[this.indexModalEdicionServicio].cantidad_mensual= model.cantidad_mensual;

        let arrayServicio= JSON.stringify(this.modelServicioContratado[this.indexModalEdicionServicio]);
        let modelArray: any = {
          arrayServicio: arrayServicio,
        }
        this.loader = true;
        this.servicio.editServicio(modelArray, this.selectedId)
        .subscribe(
            data => {
              this.modelServicioContratado= [];
              this.cargarDatosServicios(data);
              this.isSubmitServicio= false;
              this.servicioRecurrenteEdit= false;
              this.formEditServicio.reset({
                id_servicio: '',
                cantidad_mensual: '',
              });
              this.toastyService.info("El servicio fue editado exitosamente");
              this.loader = false;
              this.modalEditServicio.hide();
            },
            error => {
              this.modelServicioContratado.pop();
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formEditServicio= this.fb.group({
          id_servicio: [this.formEditServicio.get('id_servicio').value, Validators.compose([
              Validators.required,
          ])],
          cantidad_mensual: '',
          fecha_comienzo: [this.formCreateServicio.get('fecha_comienzo').value, Validators.compose([
              Validators.required,
          ])],
        })
      }

    }

  }

  onDeleteServicio(servicio: ServicioContratado, index: number){
    this.deleteServicio= servicio;
    this.posicionEliminarServicio= index;
  }

  //ELIMINAR EL CONTACTO
  deleteServicioBrief(){
    this.loader= true;
    this.servicio.deleteServicio(this.deleteServicio.id)
    .subscribe(
        data => {
          $('#eliminar-servicio').modal('hide');
          this.modelServicioContratado.splice(this.posicionEliminarServicio, 1);
          this.loader= false;
          this.toastyService.error("El servicio fue eliminado exitosamente");
          $('#mensaje-servicio-eliminado').modal('show');
        },
        error => {
          this.alert_server.messageError(error);
          this.loader= false;
        }
    );
  }

  //EDICION
  // EDICION DE CLIENTES PRINCIPAL
  editClientePrincipal(){
    this.isSubmitClientePrincipal= true;
    if (this.formClientePrincipal.valid && this.isSubmitClientePrincipal) {
      if (this.modelContacto.length >= 1) {
        if (this.modelServicioContratado.length >= 1) {
          let arrayContacto= JSON.stringify(this.modelContacto);
          let arrayServicio= JSON.stringify(this.modelServicioContratado);

          if (this.formClientePrincipal.get('fecha_comienzo').value) {
            var fecha_comienzo: any = [this.formClientePrincipal.get('fecha_comienzo').value.date.year, this.formClientePrincipal.get('fecha_comienzo').value.date.month, this.formClientePrincipal.get('fecha_comienzo').value.date.day].join('-');
          }else{
            var fecha_comienzo= this.formClientePrincipal.get('fecha_comienzo').value;
          }

          let model: Object= {
            nombre: this.formClientePrincipal.get('nombre').value,
            pm_asignado: this.formClientePrincipal.get('pm_asignado').value,
            fecha_comienzo: fecha_comienzo,
            monto_abono: this.formClientePrincipal.get('monto_abono').value,
            scoring: this.formClientePrincipal.get('scoring').value,
            arrayContacto: arrayContacto,
            arrayServicio: arrayServicio,
            principal: 1,
          };
          this.isSubmitClientePrincipal= false;
          this.loader = true;
          this.servicio.update(model, this.selectedId)
          .subscribe(
              data => {
                this.toastyService.success("El cliente fue editado exitosamente");
                this.loader = false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader = false;
              }
          );
        }else{
          this.toastyService.error("Debe asignar al menos un servicio al brief");
          this.loader = false;
        }
      }else{
          this.toastyService.error("Debe asignar al menos un comtacto al brief");
          this.loader = false;
      }
    }else{
      this.formClientePrincipal= this.fb.group({
        nombre: [this.formClientePrincipal.get('nombre').value, Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            Validaciones.verificarEspacios,
        ])],
        pm_asignado: [this.formClientePrincipal.get('pm_asignado').value, Validators.compose([
            Validators.required,
        ])],
        fecha_comienzo: [this.formClientePrincipal.get('fecha_comienzo').value, Validators.compose([
            Validators.required,
        ])],
        monto_abono: [this.formClientePrincipal.get('monto_abono').value, Validators.compose([
            Validators.required,
        ])],
        scoring: this.formClientePrincipal.get('scoring').value,
      })
    }
  }

  // EDICION DE CLIENTES ADMINSTRACION
  editClienteAdministracion(){
    this.isSubmitClienteAdministracion= true;
    if (this.formClienteAdministracion.valid && this.isSubmitClienteAdministracion) {

          let model: Object= {
            id_metodo_facturacion: this.formClienteAdministracion.get('id_metodo_facturacion').value,
            contrato_firmado: this.formClienteAdministracion.get('contrato_firmado').value,
            quien_factura: this.formClienteAdministracion.get('quien_factura').value,
            id_forma_pago: this.formClienteAdministracion.get('id_forma_pago').value,
            condicion_iva: this.formClienteAdministracion.get('condicion_iva').value,
            cuit: this.formClienteAdministracion.get('cuit').value,
            asunto_factura: this.formClienteAdministracion.get('asunto_factura').value,
            nombre_fiscal: this.formClienteAdministracion.get('nombre_fiscal').value,
            direccion_retiro_pago: this.formClienteAdministracion.get('direccion_retiro_pago').value,
            administracion: 1
          };
          this.isSubmitClientePrincipal= false;
          this.loader = true;
          this.servicio.update(model, this.selectedId)
          .subscribe(
              data => {
                this.toastyService.success("El cliente fue editado exitosamente");
                this.loader = false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader = false;
              }
          );
    }else{
      this.formClienteAdministracion= this.fb.group({
        id_metodo_facturacion: this.formClienteAdministracion.get('id_metodo_facturacion').value,
        contrato_firmado: [this.formClienteAdministracion.get('contrato_firmado').value, Validators.compose([
            Validators.required,
        ])],
        quien_factura: this.formClienteAdministracion.get('quien_factura').value,
        id_forma_pago: this.formClienteAdministracion.get('id_forma_pago').value,
        condicion_iva: this.formClienteAdministracion.get('condicion_iva').value,
        cuit: this.formClienteAdministracion.get('cuit').value,
        asunto_factura: this.formClienteAdministracion.get('asunto_factura').value,
        nombre_fiscal: this.formClienteAdministracion.get('nombre_fiscal').value,
        direccion_retiro_pago: this.formClienteAdministracion.get('direccion_retiro_pago').value,
      })
    }
  }

  // EDICION DE CLIENTES PRINCIPAL
  editClienteVentas(){
    this.isSubmitClienteVentas= true;
    if (this.formClienteVentas.valid && this.isSubmitClienteVentas) {

          let arrayCanalAdquisicion= JSON.stringify(this.formClienteVentas.get('id_canal_adquisicion').value);

          let model: Object= {
            propuesta_original: this.formClienteVentas.get('propuesta_original').value,
            arrayCanalAdquisicion: arrayCanalAdquisicion,
            comentario_adquisicion: this.formClienteVentas.get('comentario_adquisicion').value,
            puntaje_cliente: this.formClienteVentas.get('puntaje_cliente').value,
            ventas: 1
          };
          this.isSubmitClienteVentas= false;
          this.loader = true;
          this.servicio.update(model, this.selectedId)
          .subscribe(
              data => {
                this.toastyService.success("El cliente fue editado exitosamente");
                this.loader = false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader = false;
              }
          );
    }else{
      this.formClienteVentas= this.fb.group({
        propuesta_original: [this.formClienteVentas.get('propuesta_original').value,  Validators.compose([
            Validators.required,
        ])],
        id_canal_adquisicion: [this.formClienteVentas.get('id_canal_adquisicion').value, Validators.compose([
            Validators.required,
        ])],
        comentario_adquisicion: [this.formClienteVentas.get('comentario_adquisicion').value,  Validators.compose([
            Validators.required,
        ])],
        puntaje_cliente: [this.formClienteVentas.get('puntaje_cliente').value,  Validators.compose([
            Validators.required,
            Validators.pattern(/^(?:10|[1-9])$/m),
        ])],
      })
    }
  }

  // EDICION DE CLIENTES PRINCIPAL
  editClienteCampanas(){
    this.isSubmitClienteCampanas= true;
    if (this.formClienteCampanas.valid && this.isSubmitClienteCampanas) {
          let model: Object= {
            presupuesto_invertir_publicidad: this.formClienteCampanas.get('presupuesto_invertir_publicidad').value,
            distribucion_presupuesto_publicidad: this.formClienteCampanas.get('distribucion_presupuesto_publicidad').value,
            objetivo_mensual: this.formClienteCampanas.get('objetivo_mensual').value,
            campanas: 1
          };
          this.isSubmitClienteCampanas= false;
          this.loader = true;
          this.servicio.update(model, this.selectedId)
          .subscribe(
              data => {
                this.toastyService.success("El cliente fue editado exitosamente");
                this.loader = false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader = false;
              }
          );
    }else{
      this.formClienteCampanas= this.fb.group({
        presupuesto_invertir_publicidad: [this.formClienteCampanas.get('presupuesto_invertir_publicidad').value, Validators.compose([
            Validators.required,
        ])],
        distribucion_presupuesto_publicidad: this.formClienteCampanas.get('distribucion_presupuesto_publicidad').value,
        objetivo_mensual: [this.formClienteCampanas.get('objetivo_mensual').value, Validators.compose([
          Validators.pattern(/^([0-9]|[0-9][0-9]|[0-9][0-9][0-9]|[0-9][0-9][0-9][0-9]|[0-9][0][0][0][0])$/m),
        ])]
      })
    }
  }

  // EDICION DE CLIENTES DISEÑO
  editClienteDiseno(){
    this.isSubmitClienteDiseno= true;
    if (this.formClienteDiseno.valid && this.isSubmitClienteDiseno) {
          let model: Object= {
            sitio_web: this.formClienteDiseno.get('sitio_web').value,
            fan_page: this.formClienteDiseno.get('fan_page').value,
            diseno: 1
          };
          this.isSubmitClienteDiseno= false;
          this.loader = true;
          this.servicio.update(model, this.selectedId)
          .subscribe(
              data => {
                this.toastyService.success("El cliente fue editado exitosamente");
                this.loader = false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader = false;
              }
          );
    }else{
      this.formClienteDiseno= this.fb.group({
        sitio_web: this.dataCliente.sitio_web,
        fan_page: this.dataCliente.fan_page,
      })
    }
  }

  // EDICION DE CLIENTES DETALLE EMPRESA
  editClienteDetalleEmpresa(){
    this.isSubmitClienteDetalleEmpresa= true;
    if (this.formClienteDetalleEmpresa.valid && this.isSubmitClienteDetalleEmpresa) {

          let arrayTipoEmpresa= JSON.stringify(this.formClienteDetalleEmpresa.get('id_tipo_empresa').value);
          let arrayTipoVenta= JSON.stringify(this.formClienteDetalleEmpresa.get('id_tipo_venta').value);

          let model: Object= {
            rubro: this.formClienteDetalleEmpresa.get('rubro').value,
            arrayTipoEmpresa: arrayTipoEmpresa,
            arrayTipoVenta: arrayTipoVenta,
            modelo_negocio: this.formClienteDetalleEmpresa.get('modelo_negocio').value,
            calidad_modelo_negocio: this.formClienteDetalleEmpresa.get('calidad_modelo_negocio').value,
            acciones_realiza_internet: this.formClienteDetalleEmpresa.get('acciones_realiza_internet').value,
            upselibilidad: this.formClienteDetalleEmpresa.get('upselibilidad').value,
            comentario_upselibilidad: this.formClienteDetalleEmpresa.get('comentario_upselibilidad').value,
            educabilidad: this.formClienteDetalleEmpresa.get('educabilidad').value,
            comentario_educabilidad: this.formClienteDetalleEmpresa.get('comentario_educabilidad').value,
            conocimiento_internet: this.formClienteDetalleEmpresa.get('conocimiento_internet').value,
            capacidad_financiera_cliente: this.formClienteDetalleEmpresa.get('capacidad_financiera_cliente').value,
            nivel_esperado_hinchapelotes: this.formClienteDetalleEmpresa.get('nivel_esperado_hinchapelotes').value,
            competidores_cliente: this.formClienteDetalleEmpresa.get('competidores_cliente').value,
            personalidad: this.formClienteDetalleEmpresa.get('personalidad').value,
            detalle_empresa: 1
          };
          this.isSubmitClienteDetalleEmpresa= false;
          this.loader = true;
          this.servicio.update(model, this.selectedId)
          .subscribe(
              data => {
                this.toastyService.success("El cliente fue editado exitosamente");
                this.loader = false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader = false;
              }
          );
    }else{
      this.formClienteDetalleEmpresa= this.fb.group({
        id_tipo_empresa: [this.formClienteDetalleEmpresa.get('id_tipo_empresa').value, Validators.compose([
            Validators.required,
        ])],
        rubro: [this.formClienteDetalleEmpresa.get('rubro').value, Validators.compose([
            Validators.required,
        ])],
        id_tipo_venta: [this.formClienteDetalleEmpresa.get('id_tipo_venta').value, Validators.compose([
            Validators.required,
        ])],
        modelo_negocio: [this.formClienteDetalleEmpresa.get('modelo_negocio').value, Validators.compose([
            Validators.required,
        ])],
        calidad_modelo_negocio: [this.formClienteDetalleEmpresa.get('calidad_modelo_negocio').value, Validators.compose([
            Validators.required,
        ])],
        acciones_realiza_internet: [this.formClienteDetalleEmpresa.get('acciones_realiza_internet').value, Validators.compose([
            Validators.required,
        ])],
        upselibilidad: [this.formClienteDetalleEmpresa.get('upselibilidad').value, Validators.compose([
            Validators.required,
        ])],
        comentario_upselibilidad: [this.formClienteDetalleEmpresa.get('comentario_upselibilidad').value, Validators.compose([
            Validators.required,
        ])],
        educabilidad: [this.formClienteDetalleEmpresa.get('educabilidad').value, Validators.compose([
            Validators.required,
        ])],
        comentario_educabilidad: [this.formClienteDetalleEmpresa.get('comentario_educabilidad').value, Validators.compose([
            Validators.required,
        ])],
        conocimiento_internet: [this.formClienteDetalleEmpresa.get('conocimiento_internet').value, Validators.compose([
            Validators.required,
        ])],
        capacidad_financiera_cliente: [this.formClienteDetalleEmpresa.get('capacidad_financiera_cliente').value, Validators.compose([
            Validators.required,
        ])],
        nivel_esperado_hinchapelotes: [this.formClienteDetalleEmpresa.get('nivel_esperado_hinchapelotes').value, Validators.compose([
            Validators.required,
        ])],
        competidores_cliente: [this.formClienteDetalleEmpresa.get('competidores_cliente').value, Validators.compose([
            Validators.required,
        ])],
        personalidad: [this.formClienteDetalleEmpresa.get('personalidad').value, Validators.compose([
            Validators.required,
        ])],
      })
    }
  }

  // EDICION DE CLIENTES PM
  editClientePM(){
    this.isSubmitClientePM= true;
    if (this.formClientePM.valid && this.isSubmitClientePM) {
          let model: Object= {
            etapa: this.formClientePM.get('etapa').value,
            resumen_cliente: this.formClientePM.get('resumen_cliente').value,
            pm: 1
          };
          this.isSubmitClientePM= false;
          this.loader = true;
          this.servicio.update(model, this.selectedId)
          .subscribe(
              data => {
                this.toastyService.success("El cliente fue editado exitosamente");
                this.loader = false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader = false;
              }
          );
    }else{
      this.formClientePM= this.fb.group({
        etapa: [this.formClientePM.get('etapa').value, Validators.compose([
            Validators.required,
        ])],
        resumen_cliente: this.formClientePM.get('resumen_cliente').value,
      })
    }
  }

  // CAPTURAR FECHA DE COMIENZO
  capturarFechaComienzo(event: any, campo: string){
    this.guardarCambio(campo, event.formatted, 'formClientePrincipal');
  }

  guardarCambio(campo: any, valorCampo: any, nameForm: any){

    if (nameForm == 'formClientePrincipal') {

        var validForm= this.formClientePrincipal.get(campo).valid;

    }else if (nameForm == 'formClienteAdministracion') {

        var validForm= this.formClienteAdministracion.get(campo).valid;

    }else if (nameForm == 'formClienteVentas') {

        var validForm= this.formClienteVentas.get(campo).valid;

    }else if (nameForm == 'formClienteCampanas') {

        var validForm= this.formClienteCampanas.get(campo).valid;

    }else if (nameForm == 'formClienteDiseno') {

      var validForm= this.formClienteDiseno.get(campo).valid;

    }else if (nameForm == 'formClienteDetalleEmpresa') {

        var validForm= this.formClienteDetalleEmpresa.get(campo).valid;

    }else if (nameForm == 'formClientePM') {

        var validForm= this.formClientePM.get(campo).valid;

    }

    if (validForm || campo == 'fecha_comienzo' || campo == 'fecha_primera_reunion' || campo == 'fecha_baja') {
      if (campo == 'id_canal_adquisicion') {
        valorCampo=  JSON.stringify(this.formClienteVentas.get(campo).value);
      }

      if (campo == 'id_tipo_empresa') {
        valorCampo=  JSON.stringify(this.formClienteDetalleEmpresa.get(campo).value);
      }

      if (campo == 'id_tipo_venta') {
        valorCampo=  JSON.stringify(this.formClienteDetalleEmpresa.get(campo).value);
      }
      this.estadoGuardado= false;
      let model: Object = {
        campo: campo,
        valorCampo: valorCampo,
      }
      this.servicio.update(model, this.selectedId)
      .subscribe(
        data => {
          this.estadoGuardado= true;
          this.cargarDatosCliente(data.cliente);
        },
        error => {
          this.estadoGuardado= false;
          this.alert_server.messageError(error);
        }
      );
    }

  }

  // VERIFICAR SI FIRMO CONTRATO
  firmoContrato(firmo: any){
    if (firmo == true) {
      $('#adjuntar-contrato').modal('show');
    }
  }

  // VERIFICAR SI SUBIO EL ARCHIVO
  verificarSubidaArchivo(e: any){
    if (e) {
      var data= JSON.parse(e.xhr.response);
      this.cargarDatosCliente(data.cliente);
      $('#adjuntar-contrato').modal('hide');
      this.toastyService.success("El contrato se adjunto correctamente");
    }
  }

  //VERIFICAR SI HAY ALGUN ERROR AL SUVIR ARCHIVO
  verificarErrorArchivo(e: any){
    if (e) {
      $('#adjuntar-contrato').modal('show');
      this.toastyService.error("Ocurrió un error en la subida del archivo, intente mas tarde");
    }
  }

  // GUARDAR CAMBIOS DE BRIEF AUTOMATICAMENTE
  guardarCambioBrief(campo: string, valorCampo: any, nameForm: any){

    if (nameForm == 'formClienteCampanas') {

        var validForm= this.formClienteCampanas.get(campo).valid;

    }else if (nameForm == 'formClienteDiseno') {

      var validForm= this.formClienteDiseno.get(campo).valid;

    }else if (nameForm == 'formClienteDetalleEmpresa') {

        var validForm= this.formClienteDetalleEmpresa.get(campo).valid;

    }else if (nameForm == 'formClienteAdministracion') {

        var validForm= this.formClienteAdministracion.get(campo).valid;

    }else if (nameForm == 'formClienteChecklist') {

        var validForm= this.formClienteAdministracion.get(campo).valid;

    }

    if (validForm) {
      this.estadoGuardado= false;
      let model: any= {
        id: this.dataBrief.id,
        campo: campo,
        valorCampo: valorCampo,
        id_cliente: this.selectedId,
        saveCBriefCliente: 1
      }
      this.servicioBriefPrimeraReunion.update(model)
      .subscribe(
        data => {
          this.estadoGuardado= true;
        },
        error => {
          this.estadoGuardado= false;
          this.alert_server.messageError(error);
        }
      );

    }
  }


}
