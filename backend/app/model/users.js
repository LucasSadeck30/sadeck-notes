
const prisma = require('../config/database.js')
const bcrypt = require('bcrypt');

class UsersModel {



static async CreateUser(req,res){


  try {
    console.log("teste");
    console.log(`O valor que vem do req.body É ${req.body.name}`);
    
    
  const transformar_para_hash_password = await bcrypt.hash(req.body.password, 10 )
 console.log("teste do hash: ",transformar_para_hash_password);
 


    const newUser = await prisma.users.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: transformar_para_hash_password,
        created_at: new Date(),
        updated_at: new Date(),

      },
    });
    console.log(`O valor do novo usuário é ${newUser}`);
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }

}


static async FindUser(filtro,req,res){


  try {
 
 const user = await prisma.users.findUnique({
  where: {
    email: filtro
  },
});

return user


  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }

}




  }

  module.exports = UsersModel