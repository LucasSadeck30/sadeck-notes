var express = require('express');
var router = express.Router();
const prisma = require('../config/database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const WithAuth = require('../middlewares/auth.js');
const secret = process.env.JWT_TOKEN

const UsersModel = require('../model/users.js');



// Get all users
router.get('/', async (req, res) => {
  try {
     console.log('Tentando conectar ao banco...');
    const users = await prisma.users.findMany();
        console.log('Usuários encontrados:', users);
    res.json(users);
  } catch (error) {
     console.error('ERRO COMPLETO:', error);
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Error getting users' });
  }
});



router.post('/login', async (req, res) => {

  // vou precisar fazer uma verificação entre o password do banco de dados e o que o usuário manda na requisição
  const { email, password } = req.body
  console.log(email);

  // acha o usuário no banco através do email

  try {

    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      console.log(`usuário não encontrado`);
      return res.status(401).json({ error: "User not found" });
    }




    const compare = await bcrypt.compare(password, user.password)
    console.log(`the value of password are the same ${compare}`);

    // caso de true
    if (compare == true) {
      const token = jwt.sign({ email }, secret, { expiresIn: '10d' })

      // devolver para o usuário seus dados e o token
      res.json({ user: user, token: token })
    } else if (compare == false) {

      res.status(404).json({ message: "User password or email is incorrect" })

    }


  } catch (error) {
    console.log({ error: "User password or email is incorrect" });
  }






});






// Create a new user
router.post('/register', UsersModel.CreateUser)



// Get a user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting user' });
  }
});


// Update a user by ID
router.put('/:id', WithAuth, async (req, res) => {
 // console.log(`O valor de req é ${req.body}`);

  try {

  const { id } = req.params;
  const { name, email } = req.body
  console.log(`O valor de name È ${name} e do email é ${email} `);

      // // não estando vazio a nova senha, chama o usuário atual pelo banco, para comparar os valores das senhas
   

      // tem que criar uma lógica que verifique se o usuário recebeu um email que está identico ao do banco, caso sim, vai ter que regerar o token e 
      // o usuário atualizado, então tem que fazer duas queries no banco pra caçar o usuário 
   

    const user = await prisma.users.findFirst({
      where: {
         id: parseInt(id),
      },
       });

      console.log(`O valor de de user é ${user.email}`);


      if(email == user.email){
// caso seja igual é só atualizar o nome e pronto


     const updatedUser = await prisma.users.update({
          where: {
            id: parseInt(id),
          },
          data: {
            name: name,
            email: email,
            updated_at: new Date()
          },
        });
        return res.json({ user: updatedUser });
      }

      else{
        console.log(`Entrou no else`);
        

        // se for um novo email tem algumas etapas

        // 1) atualizar o usuário e seu novo email

      await prisma.users.update({
          where: {
            id: parseInt(id),
          },
          data: {
            name: name,
            email: email,
            updated_at: new Date()
          },
        });

        console.log(`O valor do id é ${id}`);
        
    // 2) buscar o usuário atualizado no banco de dados
          const newuser = await prisma.users.findFirst({
      where: {
         id: parseInt(id),
      },
       });

       // 2) Gerar um novo token
      const token = await jwt.sign({ email: newuser.email }, secret, { expiresIn: '10d' })

       console.log(`O valor do token agora é ${token}`);
       
       
       /// 3) passar no Json esse novo token e usuário
       return res.json({ user: newuser, token: token })

   
     }
      
     }catch (error) {
   return res.status(500).json({ error: 'Error updating user' });
  }

});



// tela de alteração de senha do usuário
router.put('/changePassword/:id', WithAuth, async (req, res) => {
 console.log(`O valor de req é ${req.body}`);

  try {

  const { id } = req.params;
  const { currentPassword, newPassword } = req.body
  console.log(`O valor do currentPassword é ${currentPassword} e o valor do newPassword é ${newPassword} e o valor do id é ${id}`);



      // não estando vazio a nova senha, chama o usuário atual pelo banco, para comparar os valores das senhas
      const user = await prisma.users.findFirst({
        where: {
         id: parseInt(id),
        },
      });

      console.log(`O valor de user é ${user}`);
      

      // comparação entre a senha atual do banco de dados e a senha atual que o usuário mandou na requisição
      let compare = await bcrypt.compare(currentPassword, user.password)
      console.log(`O valor de compare deu ${compare}`);


      if (compare == true) {
        console.log(`As senhas antiga com a que está no banco são as  mesmas`);
        // dando certo agora a atualização da senha vem com o valor no novo campo password

        // mas antes tem que transformar a nova senha em hash para salvar no banco de dados
        const transformar_para_hash_password = await bcrypt.hash(newPassword, 10)

        const updatedUser = await prisma.users.update({
          where: {
            id: parseInt(id),
          },
          data: {
            password: transformar_para_hash_password,
            updated_at: new Date()
          },
        });
                res.json(updatedUser)
                 

      
      }


      else if (compare == false) {
      console.log(`O valor da senha passada pelo usuário não bate com a senha antiga`);
      // se a comparação está errada significa que o usuário 
      
       return res.status(500).json({ error: 'Error password user' });
    }

  } catch (error) {
   return res.status(500).json({ error: 'Error updating user' });
  }


});



















// Delete a user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
