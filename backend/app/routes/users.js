var express = require('express');
var router = express.Router();
const prisma = require('../config/database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config()
const WithAuth = require('../middlewares/auth.js');
const secret = process.env.JWT_TOKEN

const UsersModel = require('../model/users.js');
const EmailService = require('../services/emailService.js');



// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
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



// Criação da rota lostPassword para trabalhar com o 
router.post('/lostPassword', async (req, res) => {

  // vou precisar fazer uma verificação entre o password do banco de dados e o que o usuário manda na requisição
  const { email } = req.body

  console.log(`📧 Solicitação de reset para: ${email}`);
  // acha o usuário no banco através do email

  try {

    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });


    console.log('👤 Usuário encontrado?', user ? 'SIM' : 'NÃO')

    if (!user) {
       console.log('❌ Usuário não encontrado');
      return res.status(200).json({ 
        message: "Se o email existir, você receberá instruções de recuperação" 
      });
    }

    console.log('✅ Usuário existe! ID:', user.id);

     // 2. Gerar token único de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora



    console.log('Token gerado:', resetToken.substring(0, 10) + '...');
    // 3. Salvar token na tabela password_reset_tokens
    await prisma.password_reset_tokens.create({
      data: {
        user_id: user.id,
        token: resetToken,
        expires_at: expiresAt,
        used: false
      }
    });



    // 4. Enviar email
    const emailResult = await EmailService.sendPasswordReset(email, resetToken);

    if (!emailResult.success) {
      return res.status(500).json({ error: "Erro ao enviar email" });
    }

    console.log(`Email de reset enviado para ${email}`);
    
    return res.status(200).json({ 
      message: "Se o email existir, você receberá instruções de recuperação" 
    });

   



  } catch (error) {
       console.error('💥 ERRO COMPLETO:', error);
    console.error('📛 Nome do erro:', error.name);
    console.error('📝 Mensagem:', error.message);
    console.error('📍 Stack:', error.stack);
    return res.status(500).json({ error: "Erro no servidor" });
  }

});


router.post('/resetPassword', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // 1. Buscar token no banco
    const resetToken = await prisma.password_reset_tokens.findUnique({
      where: { token: token },
      include: { users: true }
    });

    // 2. Validar token
    if (!resetToken) {
      return res.status(400).json({ error: "Token inválido" });
    }

    if (resetToken.used) {
      return res.status(400).json({ error: "Token já foi usado" });
    }

    if (new Date() > resetToken.expires_at) {
      return res.status(400).json({ error: "Token expirado" });
    }

    // 3. Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Atualizar senha do usuário
    await prisma.users.update({
      where: { id: resetToken.user_id },
      data: { 
        password: hashedPassword,
        updated_at: new Date()
      }
    });

    // 5. Marcar token como usado
    await prisma.password_reset_tokens.update({
      where: { id: resetToken.id },
      data: { used: true }
    });

    console.log(`Senha resetada para usuário ID: ${resetToken.user_id}`);

    return res.status(200).json({ 
      message: "Senha alterada com sucesso!" 
    });

  } catch (error) {
    console.error('Erro em resetPassword:', error);
    return res.status(500).json({ error: "Erro no servidor" });
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
