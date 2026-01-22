// Test login vía HTTP
const testLoginHTTP = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@skillforge.ai',
                password: 'admin',
            }),
        });

        const data = await response.json();

        console.log('===========================================');
        console.log('TEST DE LOGIN HTTP');
        console.log('===========================================');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('\n✅ LOGIN EXITOSO');
            console.log('Token recibido:', data.token ? 'SÍ' : 'NO');
            console.log('Usuario:', data.user);
        } else {
            console.log('\n❌ LOGIN FALLIDO');
            console.log('Error:', data.message);
        }
        console.log('===========================================');
    } catch (error) {
        console.error('Error al realizar el test:', error);
    }
};

testLoginHTTP();
