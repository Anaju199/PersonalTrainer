import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClientesService } from './clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  listaClientes: Cliente[] = [];
  paginaAtual: number = 1;
  totalPaginas: number = 1;
  itensPorPagina: number = 10;
  filtroCliente: string = ''
  mes: string = ''
  ano: number = -1

  constructor(
    private service: ClientesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarClientes()
  }

  carregarClientes(){
    this.service.listarTodos(this.paginaAtual, this.itensPorPagina).subscribe((response) => {
      this.listaClientes = response.results
      this.totalPaginas = Math.ceil(response.count/this.itensPorPagina)
    })
  }

  // carregarClientes() {
  //   this.service.listarTodos(this.paginaAtual, this.itensPorPagina).subscribe((response) => {
  //     this.listaClientes = response.results.map((membro: Cliente) => {
  //       return {
  //         ...membro,
  //         // Mantém a data no formato de string, pois já está em ISO
  //         dataNascimento: membro.data_nascimento
  //       };
  //     });
  //     this.totalPaginas = Math.ceil(response.count / this.itensPorPagina);
  //   });
  // }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.carregarClientes();
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.carregarClientes();
    }
  }

  habilitarBotao(direcao: string): string {
    if (direcao === 'anterior' && this.paginaAtual === 1) {
      return 'botao_pag_desabilitado';
    }
    if (direcao === 'proxima' && this.paginaAtual === this.totalPaginas) {
      return 'botao_pag_desabilitado';
    }
    return 'botao_pag';
  }

  voltar() {
    this.router.navigate(['/administrador'])
  }


  excluir(id: number) {
    if (confirm('Tem certeza que deseja excluir?')){
      this.service.excluir(id).subscribe(() => {
        alert('Cliente excluido com sucesso.')
        this.recarregarComponente()
      })
    }
  }

  recarregarComponente(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = 'reload'
    this.router.navigate([this.router.url])
  }

  pesquisarCliente(){
    this.service.listar(this.filtroCliente)
      .subscribe(listaTodosClientes => {
        this.listaClientes = listaTodosClientes;

      });
  }
}
