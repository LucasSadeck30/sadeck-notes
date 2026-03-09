var express = require('express');
var router = express.Router();
const prisma = require('../config/database.js');
const WithAuth = require('../middlewares/auth.js');


const isOwner = (user,notes)=>{
  

  // a lógica aqui é de passar tudo para string e depois fazer a comparação do valor do user que vem do withAuth middleware com o valor do user_id da notes
  // no caso a chave estrangeira da tabela de notes
  if(JSON.stringify(user.id) == JSON.stringify(notes.user_id)){
    return true
  }else{
    return false
  }

}

// rota de pesquisa

router.get('/search',WithAuth, async (req, res) => {


try {
  
const {query} = req.query
console.log(`O valor de query é ${query} e do user é ${req.user.id}` );
  
let search = await prisma.notes.findMany({
      where: {
        user_id: req.user.id,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { body: { contains: query, mode: 'insensitive' } },
        ]
      }
    })

  return res.status(200).json(search)// s

} catch (error) {
  
        res.status(403).json({message:"Unauthorized User!"})
}



})




// Get a note by ID
router.get('/:id', WithAuth, async (req, res) => {
 
 
  try {
      // pegar o valor da nota específica por id utililizando o req.params
      const {id} = req.params
      let note = await prisma.notes.findUnique({
        where: {
          id: parseInt(id)
        }
      })
     

      if(isOwner(req.user,note)){
        return res.status(200).json(note)// se retornar true retorna a nota
  
      }else{
        return res.status(404).json({message:"Unauthorized User!"})
      }
      

  // tem um porém agora na hora de setar essa nota, que é a questão de por exemplo, eu crio uma nota, só que outra pessoa baixa essa nota, com ]
  // senhas, passwords dados meus pessoais, ou seja, tem que verificar se o usuário é o dono dessa nota, pra isso foi criado o método

  } catch (error) {
    res.status(500).json({ error: 'Error to getting note' })
  }

})

router.get('/',WithAuth,async (req, res) => {

  
  try {
    let notes = await prisma.notes.findMany({
      where: {
        user_id: req.user.id
        },
    })
     

    return res.status(200).json(notes)
  } catch (error) {
   return res.status(500).json({ error: 'Error to getting notes' })
    
  }

})

// Criando uma nova nota
router.post('/',WithAuth, async (req, res) => {
  const { title, body } = req.body;
const user_id = req.user.id


  try {
    const newNote = await prisma.notes.create({
      data: {
        title,
        body,
        user_id,
        created_at: new Date(),
        updated_at: new Date()
      },
    });
    return res.status(201).json(newNote);
  } catch (error) {

    console.log('Erro no catch:', error) // adiciona esse log
    if (!res.headersSent) {              // só responde se ainda não respondeu
      return res.status(500).json({ error: 'Error creating note' });
    }
 
  }
 });


router.put('/:id',WithAuth, async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  try {
    // procurar a nota buscando pelo id da requisição
    let note = await prisma.notes.findUnique({
      where: {
        id: parseInt(id)
      }
    })
    // verificar se o usuário que está buscando a nota realmente é o dono
    if(isOwner(req.user,note)){

      let note_update =await prisma.notes.update({
        where: {
          id: parseInt(id)
        },
        data: {
          title,
          body,
          updated_at: new Date()         
        }
      
      })

      return res.status(200).json(note_update)
    }else{
      res.status(403).json({message:"Unauthorized User!"})
    }
    } catch (error) {
    
  }
})




router.delete('/:id',WithAuth, async (req, res) => {

  try {
 const {id} = req.params
 console.log(`O valor do id é ${id}`);
 

 // achar a nota pelo id para pegar o user_id que é a chave estrangeira
 let note =await prisma.notes.findUnique({
  where: {
    id: parseInt(id)
  }
 })


  if(isOwner(req.user,note)){
   
    let delete_note = await prisma.notes.delete({
      where: {
        id: parseInt(id)
      }
    })

    return res.status(204).json({message: "Note delete with success!"})

  }else{
      res.status(403).json({message:"Unauthorized User!"})
    }
    
  } catch (error) {
       res.status(403).json({message:"Unauthorized User!"})
  }


})







module.exports = router;