const CLIENT_ID = 'gp762nuuoqcoxypju8c569th9wz7q5'; 
const ACCESS_TOKEN = '5m19dxrep50mtenu8wj6k3lzn94nt2'; 
const BASE_URL = 'https://api.twitch.tv/helix';


function showLoading() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
}


function hideLoading() {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
}


async function getVideoData(videoId) {
    const response = await fetch(`${BASE_URL}/videos?id=${videoId}`, {
        method: 'GET',
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
    });

    if (!response.ok) {
        
        return null;
    }

    const data = await response.json();
    return data.data[0] || null; 
}


async function getUserData() {
    const response = await fetch(`${BASE_URL}/users?login=AZAZiNS_`, {
        method: 'GET',
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error al obtener datos del usuario: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0];
}


async function getLiveStreamData(userId) {
    const response = await fetch(`${BASE_URL}/streams?user_id=${userId}`, {
        method: 'GET',
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error al obtener datos del stream en vivo: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0]; 
}


function generateStatsHTML(userData, videoData, liveStreamData) {
    const isLive = !!liveStreamData;

    return `
        <div class="stream-stats">
            <h2>Estadísticas del Stream</h2>
            <p><strong>Nombre del canal:</strong> ${userData.display_name}</p>
            <p><strong>Descripción del canal:</strong> ${userData.description || 'N/A'}</p>
            <p><strong>Título del video:</strong> ${videoData.title || 'N/A'}</p>
            <p><strong>Duración del video:</strong> ${videoData.duration}</p>
            <p><strong>Vistas del video:</strong> ${videoData.view_count}</p>
            <p><strong>Fecha de publicación:</strong> ${videoData.published_at.split('T')[0]}</p>
            <p><strong>Enlace al stream:</strong> <a href="${videoData.url}" target="_blank">${videoData.url}</a></p>
            ${
                isLive
                    ? `
                        <h3>Stream en Vivo</h3>
                        <p><strong>Juego actual:</strong> ${liveStreamData.game_name}</p>
                        <p><strong>Espectadores en vivo:</strong> ${liveStreamData.viewer_count}</p>
                        <p><strong>Fecha de inicio:</strong> ${new Date(liveStreamData.started_at).toLocaleString()}</p>
                    `
                    : `
                        <p><strong>Estado:</strong> No está en vivo</p>
                        <p><strong>Link:</strong> <a href="https://twitch.tv/AZAZiNS_" target="_blank">twitch.tv/AZAZiNS_</a></p>
                    `
            }
        </div>
    `;
}


async function loadMultipleStats(videoIds) {
    const statsSection = document.getElementById('stats');
    statsSection.innerHTML = '';

    try {
        showLoading();

        const userData = await getUserData();

        for (const videoId of videoIds) {
            try {
                const videoData = await getVideoData(videoId);

                
                if (!videoData) continue;

                const liveStreamData = await getLiveStreamData(userData.id);
                const statsHTML = generateStatsHTML(userData, videoData, liveStreamData);
                statsSection.innerHTML += statsHTML;
            } catch (error) {
                console.error(`Error procesando video ${videoId}:`, error);
                continue; 
            }
        }
    } catch (error) {
        console.error('Error general:', error);
        statsSection.innerHTML = `<p>Error al cargar las estadísticas: ${error.message}</p>`;
    } finally {
        hideLoading();
    }
}


window.onload = () => loadMultipleStats(['2434713502', '2431004981', '2428546683', '2428202204', '2422309046', '2414490487', '2411574773', '2437226114', '2436628942', '2462370480', '2461265438', '2458813471', '2457976394', '2456765128', '2455329514', '2453803515', '2452840519', '2393630252']);
