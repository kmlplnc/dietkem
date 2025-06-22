const os = require('os');

function getNetworkInfo() {
  const interfaces = os.networkInterfaces();
  const networkInfo = [];

  console.log('🌐 Network Information for Testing:');
  console.log('=====================================');

  Object.keys(interfaces).forEach((interfaceName) => {
    const interface = interfaces[interfaceName];
    
    interface.forEach((alias) => {
      if (alias.family === 'IPv4' && !alias.internal) {
        const info = {
          interface: interfaceName,
          ip: alias.address,
          netmask: alias.netmask,
          mac: alias.mac
        };
        networkInfo.push(info);
        
        console.log(`📡 Interface: ${info.interface}`);
        console.log(`   IP Address: ${info.ip}`);
        console.log(`   Web App: http://${info.ip}:3003`);
        console.log(`   API Server: http://${info.ip}:3001`);
        console.log(`   Health Check: http://${info.ip}:3001/health`);
        console.log('');
      }
    });
  });

  if (networkInfo.length === 0) {
    console.log('❌ No external network interfaces found');
    console.log('   Make sure you are connected to a network');
  } else {
    console.log('✅ Use any of the above IP addresses to access from other devices');
    console.log('   Make sure both web (3003) and API (3001) servers are running');
  }
}

getNetworkInfo(); 