
onload = () => {
    var seletorArmas = document.getElementById('armas')
    criar_opcoes(seletorArmas, 'option', vetorArmas, vetorArmas.length)
    $('#armas').hide()
}
/* Cria opções no seleetor*/
/*PARAMATEROS RESPECTIVOS = 'PAI DO ELEMENTO', 'TIPO DE ELEMENTO QUE SERÁ CRIADO',
'VETOR DE ELEMENTO QUE SERÁ CRIADO' E 'NUMERO DE ELEMENTOS QUE SERÃO CIRADOS'.*/
criar_opcoes = (sourc, itemc, text = [], contador) => {

    /*Quantidade de opções definida por contador*/
    for (let i = 0; i < contador; i++) {
        var item = document.createElement(itemc)
        item.setAttribute('class', 'itemOption')
        item.innerHTML = text[i].nome
        item.onclick = () => { get_valor_seletor() }
        sourc.appendChild(item)

    }
    /*IMPORTANTE: CHAMAR A FUNÇÃO 'getValor_seletor' QUANDO UM ITEM FOR SELEICONADO NO SELETOR*/
}

get_valor_seletor = () => {
    $('#motorDeBusca').val('')
    return $('#armas').val()
}
mostrar_armas = () => {
    sessionStorage.setItem('mostrar_itens', true)
    $('#motorDeBusca').val('')
    $('#armas').show({
        duration: 500
    })
}
hide_armas = () => {
    sessionStorage.setItem('mostrar_itens', false)
    $('#armas').hide({
        duration: 400
    })
}
cadastrar = () => {

    criar_modal_inputs('input_login', 'input_password_cadastro', 'botao_confirmar_cadastro', 'CADASTRAR-SE')

    $('#botao_confirmar_cadastro').click(function () {

        if ($('#input_login').val().length != 0 && $('#input_password_cadastro').val().length != 0) {
            if (verificar_usuario($('#input_login').val(), 'teste', true) == true) {
                close_modal(false, false)
                criar_modal_texto('ERRO', 'Usuário ja cadastrado.')
            } else {
                $('#botao_entrar').hide({ duration: 'fast' })
                $('#botao_cadastrar').hide({ duration: 'fast' })
                $('#botao_sair').show({ duration: 'fast' })
                localStorage.setItem('usuario_logado', $('#input_login').val())
                armazenar_cadastro()
                close_modal(false)
                criar_modal_texto('PERSONAGEM CADASTRADO', `Bem vindo <strong>${$('#input_login').val()}</strong>.`)
            }

        } else {
            console.log('CLOSE MODAL - CADASTRAR')
            close_modal(false)
            criar_modal_texto('ERRO', 'Campo vazio.')
        }

    })
}
compra = () => {

    if (JSON.parse(sessionStorage.getItem('mostrar_itens')) == false) {
        if (verificar_item('motorDeBusca') != true) {

            criar_modal_texto('ERRO', 'ITEM NÃO ENCONTRADO.')

        } else {
            let item_buscado = $('#motorDeBusca').val()
            let valor = sessionStorage.getItem('valor_item_comprado')
            sessionStorage.setItem('nome_item_comprado', item_buscado)

            criar_modal_texto(
                'FERREIRO', `Deseja efetuar a compra de <strong>${item_buscado}</strong> no valor de <strong>${valor}</strong> moedas ?`,
                'botao_compra_modal')
        }
    } else {

        verificar_item('armas')
        let valor = sessionStorage.getItem('valor_item_comprado')
        sessionStorage.setItem('nome_item_comprado', get_valor_seletor())
        criar_modal_texto(
            'FERREIRO', `Deseja efetuar a compra de <strong>${get_valor_seletor()}</strong> no valor de <strong>${valor}</strong> moedas ?`,
            'botao_compra_modal')
    }
}
verificar_item = (local_compra) => {

    let item_buscado = $(`#${local_compra}`).val()
    for (let i = 0; i < vetorArmas.length; i++) {

        if (item_buscado.toUpperCase() == vetorArmas[i].nome.toUpperCase()) {

            sessionStorage.setItem('valor_item_comprado', vetorArmas[i].valor)
            return true
        }
    }
}
efetuar_compra = () => {

    if (get_usuario_logado() == undefined) {
        close_modal(true, true)
        criar_modal_texto('ERRO', 'Nenhum personagem logado.')
    }
    else {
        if (get_usuario_logado().itens != null && get_usuario_logado().itens.length == 16) {
            close_modal(true, true)
            criar_modal_texto('INVENTÁRIO DE ARMAS CHEIO',
                `Você atingiu o limite máximo de armas que pode carregar (<strong>${get_usuario_logado().itens.length}</strong>).`)
        } else {
            criar_som()
            armazenar_item_usuario()
            criar_item_inventario_usuario()
            close_modal(true, true)
            let nome_item = sessionStorage.getItem('nome_item_comprado')
            criar_modal_texto('COMPRA EFETUADA', `Você efetou a compra do item <strong>${nome_item}</strong>.`)
        }
    }
}

criar_som = () => {
    let audio = document.getElementById('audio_comprar');
    audio.volume = 0.2
    audio.play();
}

criar_item_inventario_usuario = () => {

    let vetor_itens_inventario = []
    vetor_itens_inventario = get_usuario_logado().itens
    inventario_vazio(false)
    let numero_coluna = criar_coluna()
    $(`#item_inventario_coluna_${numero_coluna}`).append([
        `<h4 class="item_inventario"><strong>\u{2694} ${vetor_itens_inventario[vetor_itens_inventario.length - 1].nome}</strong></h4>`
    ])
}
criar_coluna = (carregar) => {
    let vetor_itens_inventario = []
    let contador = 0;
    vetor_itens_inventario = get_usuario_logado().itens
    if (JSON.parse(localStorage.getItem('usuarios_cadastrados')) != null) {
        if (carregar != true) {
            for (let i = 0; i < vetor_itens_inventario.length; i++) {
                contador++;

            }
            if (contador >= 8) { return 2 } else { return 1 }
        } else {
            vetor_itens_inventario = get_usuario_logado().itens
            for (let i = 0; i < vetor_itens_inventario.length; i++) {
                contador++
                if (contador < 9) { var numero_coluna = 1 } else { var numero_coluna = 2 }
                $(`#item_inventario_coluna_${numero_coluna}`).append([
                    `<h4 class="item_inventario"><strong>\u{2694} ${vetor_itens_inventario[i].nome}</strong></h4>`
                ])
            }
        }
    } else {
        console.log('NENHUM USUÁRIO CADASTRADO.')
    }
}
carregar_item_inventario_usuario = () => {

    let vetor_itens_inventario = []
    vetor_itens_inventario = get_usuario_logado().itens
    if (vetor_itens_inventario != undefined) {
        console.log('INVENTARIO VAZIO - FALSE: ')
        criar_coluna(true)
        inventario_vazio(false)
    } else {
        $('#item_inventario_coluna_1').empty()
        $('#item_inventario_coluna_2').empty()
        console.log('INVENTARIO VAZIO - TRUE')
        if ($('#text_inventario_vazio').val() == undefined) { inventario_vazio(true) }

    }
}

inventario_vazio = (criar) => {
    switch (criar) {
        case true: $('#section_inventario').append([
            '<h3 id="text_inventario_vazio"><strong>Inventário vazio.</strong></h3>'])
            break;
        case false: $('#text_inventario_vazio').remove()
    }
}

armazenar_cadastro = () => {

    let vetor_usuarios = set_vetor_usuarios()
    let id_usuario = JSON.parse(localStorage.getItem('id_usuario'))
    let nome_login = $('#input_login').val()
    let senha_login = $('#input_password_cadastro').val()
    let objeto_usuarios = {
        nome: nome_login,
        senha: senha_login,
        itens: null
    }
    vetor_usuarios[id_usuario] = objeto_usuarios
    console.log(vetor_usuarios)
    localStorage.setItem('usuarios_cadastrados', JSON.stringify(vetor_usuarios))

}
if (JSON.parse(localStorage.getItem('vetor_itens_armazenados')) == null) {

    var vetor_auxiliar = []

    console.log(vetor_auxiliar)
}




armazenar_item_usuario = () => {
    let nome_item_comprado = sessionStorage.getItem('nome_item_comprado')
    let usuarios = JSON.parse(localStorage.getItem('usuarios_cadastrados'))
    let usuario_logado = localStorage.getItem('usuario_logado')
    var vetor_auxiliar = []
    for (let i = 0; i < usuarios.length; i++) {
        if (usuario_logado == usuarios[i].nome) {
            console.log('VETOR AUXILIAR - ARMAZENAR_ITEM_USUARIO: ' + vetor_auxiliar)
            if (usuarios[i].itens != null) { vetor_auxiliar = usuarios[i].itens }
            vetor_auxiliar[vetor_auxiliar.length] = get_item_objeto(nome_item_comprado)
            usuarios[i].itens = vetor_auxiliar
            console.log('USUARIOS NA POSIÇÃO I: ' + usuarios[i])
            console.log('VETOR AUXILIAR: ' + vetor_auxiliar)
            localStorage.setItem('usuarios_cadastrados', JSON.stringify(usuarios))
            localStorage.setItem('vetor_itens_armazenados', JSON.stringify(vetor_auxiliar))

        }
    }
}

get_item_objeto = (nome_item) => {

    for (let i = 0; i < vetorArmas.length; i++) {
        if (nome_item == vetorArmas[i].nome) {

            return vetorArmas[i]
        }
    }
}
criar_modal_texto = (titulo, texto, button_id) => {

    if (button_id != undefined) {

        $('#modal-footer_texto').append([`<button type="button" class="botao_modal" 
        class="btn btn-secondary" id="${button_id}" onclick="efetuar_compra()">Confirmar</button>`

        ])
    }

    $('#modal-title_texto').append([

        `<h2 id="titulo_modal">${titulo}</h2>`
    ])
    $('#modal-body_texto').append([

        `<h3>${texto}</h3>`
    ])
    $('#modal-footer_texto').append([

        '<button type="button" class="botao_modal" class="btn btn-secondary" data-dismiss="modal">Fechar</button>'
    ])

    $('#modal_base_texto').modal()

    close_modal(true)
}

set_vetor_usuarios = () => {

    if (localStorage.getItem('id_usuario') == null) {

        localStorage.setItem('id_usuario', 0)
        var vetor_usuarios = []
        return vetor_usuarios

    } else {

        let aux = JSON.parse(localStorage.getItem('id_usuario'))
        localStorage.setItem('id_usuario', JSON.stringify(aux + 1))
        var vetor_usuarios = [] = JSON.parse(localStorage.getItem('usuarios_cadastrados'))
        return vetor_usuarios

    }
}


entrar = () => {
    criar_modal_inputs('input_login', 'input_password_entrar', 'botao_confirmar_login', 'ENTRAR')
    $('#botao_confirmar_login').click(function () {
        if (verificar_usuario($('#input_login').val(), $('#input_password_entrar').val()) == false) {

            close_modal(false)
            criar_modal_texto('ERRO', 'Nome ou senha <strong>incorretos</strong>.')

        } else {
            carregar_item_inventario_usuario()
            $('#botao_entrar').hide({ duration: 'fast' })
            $('#botao_cadastrar').hide({ duration: 'fast' })
            $('#botao_sair').show({ duration: 'fast' })
            close_modal(false)
            criar_modal_texto('LOGIN BEM-SUCEDIDO', `Bem vindo <strong>${$('#input_login').val()}</strong>.`)
        }
    })
}

sair = () => {

    localStorage.setItem('usuario_logado', '')
    carregar_item_inventario_usuario()
    $('#botao_sair').hide({ duration: 'fast' })
    $('#botao_entrar').show({ duration: 'fast' })
    $('#botao_cadastrar').show({ duration: 'fast' })
    localStorage.setItem('vetor_itens_armazenados', JSON.stringify(null))
}

verificar_usuario = (nome, senha, existe) => {

    if (existe == true && localStorage.getItem('usuarios_cadastrados') != null) {

        let nome_digitado = nome
        let vetor_usuarios = [] = JSON.parse(localStorage.getItem('usuarios_cadastrados'))
        for (let i = 0; i < vetor_usuarios.length; i++) {

            if (nome_digitado.toUpperCase() == vetor_usuarios[i].nome.toUpperCase()) { return true }
        }

        return false

    } else {

        if (localStorage.getItem('usuarios_cadastrados') != null) {
            let nome_digitado = nome
            let senha_digitada = senha
            let vetor_usuarios = [] = JSON.parse(localStorage.getItem('usuarios_cadastrados'))
            let login_bem_sucedido = new Boolean()

            for (let i = 0; i < vetor_usuarios.length; i++) {

                if (nome_digitado.toUpperCase() == vetor_usuarios[i].nome.toUpperCase()
                    && senha_digitada.toUpperCase() == vetor_usuarios[i].senha.toUpperCase()) {


                    localStorage.setItem('usuario_logado', nome_digitado)
                    console.log('VETOR USUARIOS: ' + vetor_usuarios[i])
                    return vetor_usuarios[i]

                } else { login_bem_sucedido = false }
            }
            return login_bem_sucedido

        } else {

            return false

        }
    }
}

get_usuario_logado = () => {

    let nome = localStorage.getItem('usuario_logado')
    if (JSON.parse(localStorage.getItem('usuarios_cadastrados')) != null) {
        let vetor_usuarios = [] = JSON.parse(localStorage.getItem('usuarios_cadastrados'))


        for (let i = 0; i < vetor_usuarios.length; i++) {

            if (nome == vetor_usuarios[i].nome) {

                return vetor_usuarios[i]

            } else { login_bem_sucedido = false }
        }
        return false
    } else {
        console.log('NENHUM USUÁRIO CADASTRADO.')
    }
}
/*PARAMÊTROS: ID DO INPUT NOME, ID DO INPUT PASSWORD, ID DO BOTAO CONFIRMAR E TITULO*/
criar_modal_inputs = (id_nome, id_password, id_botao_confirmar, titulo) => {

    /*CRIA A IMAGEM*/
    $('#modal-titulo_input').append(
        '<img src="imgs/kisspng-dungeons-dragons-unearthed-arcana-role-playing-g-typing-5ac4ab9a4f2759.5726162215228384263242.png" id="imagem_modal">')

    /*CRIA O TITULO*/
    $('#modal-titulo_input').append([`
    <h1 id="titulo_modal">${titulo}</h1>`])

    /*CRIA OS INPUTS PARA NOME DO PERSONAGEM E SENHA*/
    $('#modal-body_input').append([
        `<label id="label_nome">NOME</label></br><input type="text" name="receptor" class="modal_input" id="${id_nome}"></br>`])

    $('#modal-body_input').append([
        `<label id="label_password">SENHA</label></br><input type="password" name="receptor" class="modal_input" id="${id_password}">`])

    /*CRIA O BOTAO CONFIRMAR COM SEU <--ID EXCLUSIVO--> E O BOTAO FECHAR */
    $('#modal-footer_input').append([
        `<button type="button" class="botao_modal" class="btn btn-primary" id="${id_botao_confirmar}">Confirmar</button>`
    ])
    $('#modal-footer_input').append([
        '<button type="button" class="botao_modal" class="btn btn-secondary" onclick="close_modal(false)">Fechar</button>'
    ])
    /*EFEITOS DO MODAL*/

    /*EXIBE O MODAL*/
    $('#modal_base_input').modal();

    /*AO SAIR EXCLUI OS ELEMENTOS CRIADO*/
    console.log('CLOSE MODAL - CRIAR_MODAL_INPUTS')
    close_modal(false)

}

close_modal = (modal_texto, edit) => {

    /*FECHA O MODAL PARA ELEMENTOS QUE CONTÉM APENAS TEXTO */
    if (modal_texto == true) {
        if (edit == true) {
            $(`#modal-body_texto`).empty()
            $('#modal-title_texto').empty()
            $('#modal-footer_texto').empty()
        }
        $('#modal_base_texto').on('hidden.bs.modal', function () {
            $(`#modal-body_texto`).empty()
            $('#modal-title_texto').empty()
            $('#modal-footer_texto').empty()
        })
        /*FECHA O MODAL PARA ELEMENTOS QUE CONTÉM INPUTS*/
    } else {
        $('#modal_base_input').modal('hide')
        $('#modal_base_input').on('hidden.bs.modal', function () {
            $('#modal-body_input').empty()
            $('#modal-titulo_input').empty()
            $('#modal-footer_input').empty()
        })
    }
}
$(document).ready(function () {

    /*CRIA SUGESTÕES NO CAMPO DE BUSCA*/
    /*Preenche um vetor auxiliar com todos os nomes das armas*/
    var vetor_nome_armas = []
    for (let i = 0; i < vetorArmas.length; i++) {
        vetor_nome_armas[i] = vetorArmas[i].nome
    }
    $('#motorDeBusca').autocomplete({
        minLength: 2,
        source: vetor_nome_armas
    })

    /*IMPORTANTE: SE USUARIOS_CADASTRADOS FOR DIFERENTE DE 'NULL', RECEBER ELE MESMO */
    if (localStorage.getItem('usuarios_cadastrados') != null) {

        let aux = JSON.parse(localStorage.getItem('usuarios_cadastrados'))
        localStorage.setItem('usuarios_cadastrados', JSON.stringify(aux))
    }
    sessionStorage.setItem('mostrar_itens', false)



    if (JSON.parse(localStorage.getItem('usuario_logado') == '') || localStorage.getItem('usuario_logado') == null) {
        inventario_vazio(true)
        $('#botao_sair').hide()
    } else {
        $('#botao_entrar').hide()
        $('#botao_cadastrar').hide()
        carregar_item_inventario_usuario()
        console.log('INVENTÁRIO CARREGADO.')
    }
});

/*TODAS AS ARMAS COM RESPECTIVOS NOMES E VALORES*/
var dardo = {
    nome: 'Dardo',
    valor: 0.05
}
var funda = {
    nome: 'Funda',
    valor: 0.1
}
var porrete = {
    nome: 'Porrete',
    valor: 0.1
}
var bordao = {
    nome: 'Bordão',
    valor: 0.2
}
var clava_Grande = {
    nome: 'Clava grande',
    valor: 0.2
}
var azagaia = {
    nome: 'Azagaia',
    valor: 0.5
}
var foice_cortante = {
    nome: 'Foice cortante',
    valor: 1
}
var lanca = {
    nome: 'Lança',
    valor: 1
}
var rede = {
    nome: 'Rede',
    valor: 1
}
var adaga = {
    nome: 'Adaga',
    valor: 2
}
var martelo_Leve = {
    nome: 'Martelo leve',
    valor: 2
}
var chicote = {
    nome: 'Chicote',
    valor: 2
}
var maca = {
    nome: 'Maca',
    valor: 5
}
var machadinha = {
    nome: 'Machadinha',
    valor: 5
}
var lanca_Longa = {
    nome: 'Lança longa',
    valor: 5
}
var picareta_Guerra = {
    nome: 'Picareta de guerra',
    valor: 5
}
var espada_Curta = {
    nome: 'Espada curta',
    valor: 10
}
var lanca_Montaria = {
    nome: 'Lança de montaria',
    valor: 10
}
var machado_Batalha = {
    nome: 'Machado de batalha',
    valor: 10
}
var malho = {
    nome: 'Malho',
    valor: 10
}
var mangual = {
    nome: 'Mangual',
    valor: 10
}
var zarabatana = {
    nome: 'Zarabatana',
    valor: 10
}
var espada_Longa = {
    nome: 'Espada longa',
    valor: 15
}
var maca_Estrela = {
    nome: 'Maça estrela',
    valor: 15
}
var martelo_Guerra = {
    nome: 'Martelo de guerra',
    valor: 15
}
var alabarda = {
    nome: 'Alabarda',
    valor: 20
}
var glaive = {
    nome: 'Glaive',
    valor: 20
}
var arco_Curto = {
    nome: 'Arco curto',
    valor: 25
}
var besta_Leve = {
    nome: 'Besta leve',
    valor: 25
}
var cimitarra = {
    nome: 'Cimitarra',
    valor: 25
}
var rapieira = {
    nome: 'Rapieira',
    valor: 25
}
var machado_Grande = {
    nome: 'Machado grande',
    valor: 30
}
var espada_Grande = {
    nome: 'Espada grande',
    valor: 50
}
var arco_Longo = {
    nome: 'Arco longo',
    valor: 50
}
var besta_Pesada = {
    nome: 'Besta pesada',
    valor: 50
}
var besta_Mao = {
    nome: 'Besta de mão',
    valor: 75
}
/*ARMAZENA TODOS AS ARMAS E UM VETOR: IMPORTANTE*/
vetorArmas = [

    dardo = {
        nome: 'Dardo',
        valor: 0.05
    },
    funda = {
        nome: 'Funda',
        valor: 0.1
    },
    porrete = {
        nome: 'Porrete',
        valor: 0.1
    },
    bordao = {
        nome: 'Bordão',
        valor: 0.2
    },
    clava_Grande = {
        nome: 'Clava grande',
        valor: 0.2
    },
    azagaia = {
        nome: 'Azagaia',
        valor: 0.5
    },
    foice_cortante = {
        nome: 'Foice cortante',
        valor: 1
    },
    lanca = {
        nome: 'Lança',
        valor: 1
    },
    rede = {
        nome: 'Rede',
        valor: 1
    },
    adaga = {
        nome: 'Adaga',
        valor: 2
    },
    martelo_Leve = {
        nome: 'Martelo leve',
        valor: 2
    },
    chicote = {
        nome: 'Chicote',
        valor: 2
    },
    maca = {
        nome: 'Maca',
        valor: 5
    },
    machadinha = {
        nome: 'Machadinha',
        valor: 5
    },
    lanca_Longa = {
        nome: 'Lança longa',
        valor: 5
    },
    picareta_Guerra = {
        nome: 'Picareta de guerra',
        valor: 5
    },
    espada_Curta = {
        nome: 'Espada curta',
        valor: 10
    },
    lanca_Montaria = {
        nome: 'Lança de montaria',
        valor: 10
    },
    machado_Batalha = {
        nome: 'Machado de batalha',
        valor: 10
    },
    malho = {
        nome: 'Malho',
        valor: 10
    },
    mangual = {
        nome: 'Mangual',
        valor: 10
    },
    zarabatana = {
        nome: 'Zarabatana',
        valor: 10
    },
    espada_Longa = {
        nome: 'Espada longa',
        valor: 15
    },
    maca_Estrela = {
        nome: 'Maça estrela',
        valor: 15
    },
    martelo_Guerra = {
        nome: 'Martelo de guerra',
        valor: 15
    },
    alabarda = {
        nome: 'Alabarda',
        valor: 20
    },
    glaive = {
        nome: 'Glaive',
        valor: 20
    }
    , arco_Curto = {
        nome: 'Arco curto',
        valor: 25
    },
    besta_Leve = {
        nome: 'Besta leve',
        valor: 25
    },
    cimitarra = {
        nome: 'Cimitarra',
        valor: 25
    },
    rapieira = {
        nome: 'Rapieira',
        valor: 25
    },
    machado_Grande = {
        nome: 'Machado grande',
        valor: 30
    },
    espada_Grande = {
        nome: 'Espada grande',
        valor: 50
    },
    arco_Longo = {
        nome: 'Arco longo',
        valor: 50
    },
    besta_Pesada = {
        nome: 'Besta pesada',
        valor: 50
    },
    besta_Mao = {
        nome: 'Besta de mão',
        valor: 75
    }
]





