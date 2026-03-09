import Api from "./api";

const NotesService = {

    index:async () => await Api.get("notes/",{
      headers:{
        'x-acess-token': localStorage.getItem("token")
      }
    }),
    create:async () => await Api.post("notes/", {"title": "Nova Nota", "body": "Nova nota..."}, {
      headers:{
        'x-acess-token': localStorage.getItem("token")
      }
    }),

  delete:async (id) => await Api.delete(`notes/${id}`, {
      headers:{
        'x-acess-token': localStorage.getItem("token")
      }
    }),
  
    update:async (id,params) => await Api.put(`notes/${id}`, params, {
      headers:{
        'x-acess-token': localStorage.getItem("token")
      }
    }),
     
    search:async (query) => await Api.get(`notes/search?query=${query}`,{
      headers:{
        'x-acess-token': localStorage.getItem("token")
           }
      })
        
  }

export default NotesService;