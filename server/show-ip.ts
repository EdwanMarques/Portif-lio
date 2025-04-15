import * as os from 'os';

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];
  
  console.log('Endereços IP disponíveis para acesso:');
  console.log('-----------------------------------');
  
  for (const [name, nets] of Object.entries(interfaces)) {
    if (!nets) continue;
    
    for (const net of nets) {
      // Pular endereços IPv6 e endereços não atribuídos
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`${name}: ${net.address}`);
        addresses.push(net.address);
      }
    }
  }
  
  console.log('-----------------------------------');
  console.log('Para acessar o projeto pelo celular, use:');
  addresses.forEach(ip => {
    console.log(`http://${ip}:3000`);
  });
}

getLocalIpAddresses(); 