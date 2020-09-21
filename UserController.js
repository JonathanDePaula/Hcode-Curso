class UserController {

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit();

    }; //Aqui é o meu metodo construtor onde eu inicio todos os meu outros metodos.
    // aqui eu estou criando uma tabela de id (tableId)
    // aqui eu também estou criando um formulario de Identificações (formId)
    // veja que no constructor eu recebo o meu formId e tableId isso significa que aqui estou criado as linhas
    //dos meu ID's e Tabelas.
    //aqui tbm eu inicializo o metodo onSubmit, ou seja eu zero eele e preparo ele para escutar o que o usuario fizer.

    onEdit(){


      document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e=>{


        this.showPainelCreate();

      })


    }
    onSubmit(){

    this.formEl.addEventListener('submit', event => {

     event.preventDefault();

     let btn = this.formEl.querySelector('[type=submit]');

     btn.disabled = true;

     let values = this.getValues();

     if (!values) return false;

     this.getPhoto().then(
        (content)=>{
           
           values.photo = content;

           this.addLine(values);

           this.formEl.reset();

           btn.disabled = false;

        },
        (e)=>{

            console.error(e);

        }
     );
     

    });

    // aqui eu tenho um metodo chamado onSubmit onde eu escuto o evento do click no submit
    // e faço com que o meu metodo addLine recebe o material capturado pelo getValues

  };

  getPhoto(){

    return new Promise((resolve, reject)=>{

        let fileReader = new FileReader ();

        let elements = [...this.formEl.elements].filter(item=>{


        if (item.name === "photo"){

            return item;

        };


      });

     let file = elements[0].files[0];


      fileReader.onload = () =>{


        resolve(fileReader.result);


      };

      fileReader.onerro = (e)=>{

        reject(e);


      }

      if(file){
        fileReader.readAsDataURL(file);
      }else{
        resolve('dist/img/boxed-bg.jpg');
      }   



    });

    


  };

    getValues(){

        let user = {};
        let isValid = true;
        
                
        [...this.formEl.elements].forEach(function (field, index) {

            if(['name', ' email', 'password'].indexOf(field.name) > -1 && !field.value) {

                field.parentElement.classList.add('has-error');
                isValid = false;

            }

            if (field.name == "gender") {
        
                if (field.checked === true){
                
                    user[field.name] = field.value
        
                }
        
        
            } else if (field.name == "admin") {
                user[field.name] = field.checked;
            }else{
                user[field.name] = field.value;
            }
          
        });
    
        if(!isValid){
            return false;

        }
        return new User(user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

        
    
        
    }; //*Aqui eu estou buscando os valores colocados no meu formulario la no HTML e gerando um JASON
    //que eu envio para minha classe User.

    addLine(dataUser) {
    
        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);


     tr.innerHTML= `
        
        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
        <td>${Utils.dateFormat(dataUser.register)}</td>
        <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
            
      `;

      tr.querySelector('.btn-edit').addEventListener('click', e=>{

        let json = JSON.parse(tr.dataset.user);
        let form = document.querySelector('#form-user-update');

        console.log(form);
        
        for(let name in json){

          let field = form.querySelector('[name=' + name.replace('-' , ' ') + ']')

                    
          if (field){

            if (field.type == 'file') continue;
            field.value = json[name];

          }

          


        }

        this.showPainelUpdate();

      });
    
      this.tableEl.appendChild(tr); 

      this.updateCount();
        
    };// aqui eu tenho um metodo chamado addLine onde eu criei um parametro(função) com o nome
    // de dataUser esse dataUser tem como trabalho receber os dados recebido no getValue e passado para o addLine
    // e criar a minha lista/tabela no HTML ( aqui é onde eu manipulo o meu DOM).
    // por isso que la no construtor eu tenho um elemento chamdo tableId, nela eu falo "aqui você recebe"
    // aquilo que foi criado pelo usuario e recebido no metodo getValues.


    showPainelCreate(){

      document.querySelector('#box-user-create').style.display = 'block';
      document.querySelector('#box-user-update').style.display = 'none'

    }

    showPainelUpdate(){

      document.querySelector('#box-user-create').style.display = 'none';
      document.querySelector('#box-user-update').style.display = 'block'

    }
    updateCount(){

      let numberUsers = 0;
      let numberAdmin = 0;

      [...this.tableEl.children].forEach(tr=>{

        let user = JSON.parse(tr.dataset.user);

        numberUsers++;

        if(user._admin === true) numberAdmin++;
      });

      document.querySelector('#number-users').innerHTML = numberUsers;
      document.querySelector('#number-users-admin').innerHTML = numberAdmin;

    }// Aqui nos estamos manipulando o DOM na parte de contagem de usuarios e administradores
    //que eu tenho em minha pagina.
    // eu criei aqui 2 variaveis, numberUsers e numberAdmin e criei uma spread onde
    //vai percorerer todo o this.tableEl children onde está indo nossas linhas e fazer um forEach nas linhas
    // criei tambem uma variavel chamada user para que ele receba o tr.data.user que eu fiz ser gerado em 
    // string lá no metodo addLine quando criei um dataset da tr onde ele me permite o acesso,
    // em modo de leitura e escrita, a todos os atributos de dados personalizado
    // no elemento tr q eu recebi. Ele é um mapa de DOMString, com uma entrada para cada atributo
    // de dados personalizado.
    //depois de fazer o dataset lá eu fiz um stringfy ounde eu disse para que o objeto não permito a leitura
    // q eu criei com o dataset
    // me mostre como "string" e assim eu possa ler, porém eu preciso dele como objeto com atributos e não 
    //só como um objeto em string, por isso eu realizo depois o JSON.parse onde eu coloco a tr.data.user que
    //antes estava em string como um objeto completo e com seus atributos.
    // após fazer isso eu passo que se alguem entra como mais um usuario numberUser soma 1
    // e faço um if dando a condição de que se o numberAdmin estiver marcado ele tbm irpa somar 1 em admin.
    //por fim eu passo um document querySelector onde eu seleciono meus id's que marco meus npumeros no mostrado e faço
    //um innertHTML onde eu recebo as minhas variaveis numberUsers e numbeerAdmin que estão somando meus itens.  

};