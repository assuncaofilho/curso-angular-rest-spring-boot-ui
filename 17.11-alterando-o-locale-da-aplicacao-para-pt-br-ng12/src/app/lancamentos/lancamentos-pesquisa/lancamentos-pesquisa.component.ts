import { Component, OnInit, ViewChild } from '@angular/core';

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';

import { ILancamento } from 'src/app/core/interfaces';
import { ILancamentoFiltro } from './../../core/interfaces';
import { LancamentoService } from './../lancamento.service';


@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  filtro: ILancamentoFiltro = {
    pagina: 0,
    itensPorPagina: 5
  }
  totalRegistros: number = 0
  lancamentos: ILancamento[] = [] ;
  @ViewChild('tabela') grid: any;
  
  constructor(
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
  }
  
  pesquisar(pagina: number = 0): void {        
    this.filtro.pagina = pagina;
    
    this.lancamentoService.pesquisar(this.filtro)
      .subscribe(dados => {
        this.lancamentos = dados.content
        this.totalRegistros = dados.totalElements 
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
      const pagina = event!.first! / event!.rows!;
      this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: ILancamento): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
          this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: ILancamento) {

    this.lancamentoService.excluir(lancamento.codigo)
      .subscribe(() => {
        this.grid.reset();

        this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' })
      })
  }

}
