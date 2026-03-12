import {  Navigate, } from "react-router-dom";
import Api from "./api";



const UsersService = {

  register: async(params) => await Api.post("/users/register", params),
  login: async (params) => {
    const response = await Api.post("/users/login", params)
    console.log(`O valor que vem do     backend do usuário é ${JSON.stringify(response.data.user)} e o valor do token é ${response.data.token}`);
    
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
  },
    logout: () => {
      localStorage.removeItem("user",null);
      localStorage.removeItem("token",null);
    },



 deleteUser: async (id) => {
  console.log(`o id que vem é ${id} `);
  
    const response = await Api.delete(`/users/${id}`, {
      headers:{
        'x-acess-token': localStorage.getItem("token")
      }
    })
      
   if (response.data) {
    console.log(`entrou no if de response.data, deu certo, agora é pra deslogar e mandar para o login o usuário que foi deletado`);
    
     localStorage.removeItem("user",null);
      localStorage.removeItem("token",null);

      return true
  }
},

 updateUser: async (id,params) => {
  console.log(`o id que vem é ${id} e do params é ${params}`);
  
    const response = await Api.put(`/users/${id}`, params, {
      headers:{
        'x-acess-token': localStorage.getItem("token")
      }
    })
    //localStorage.setItem("user", JSON.stringify(response.data));

    console.log(`O valor do novo token é ${response.data.token} e do novo usuário é ${JSON.stringify(response.data.user)}`);
    
  if (response.data.token) {
   localStorage.setItem("token", response.data.token);
   localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  if (JSON.stringify(response.data.user)) {
   localStorage.setItem("user", JSON.stringify(response.data.user));
  }
},
// se a senha for alterada vai deslogar o usuário
 updateUserPassword: async (id,params) => {
  console.log(`o id que vem é ${id} e do params é ${params}`);
  
    const response = await Api.put(`/users/changePassword/${id}`, params, {
      headers:{
        'x-acess-token': localStorage.getItem("token")
      }
    })
    //localStorage.setItem("user", JSON.stringify(response.data));

    console.log(`O valor do novo token é ${response.data.token} e do novo usuário é ${JSON.stringify(response.data.user)}`);
    
    // se a resposta vier igual a true, desloga o usuaŕio, vai usar o this para chamar a função logout e o Link para redirecionar para a tela de login
  if (response.data) {
    console.log(`entrou no if de response.data, deu certo, agora é pra deslogar e mandar para o login`);
    
     localStorage.removeItem("user",null);
      localStorage.removeItem("token",null);

      return true
  }

},
// criação do service para quando o usuário perde a senha
lostPassword: async(params) => await Api.post("/users/lostPassword", params),
  
   
   
}






export default UsersService;