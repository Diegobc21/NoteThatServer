// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQApMLSsPAa_JikP-yz_etKmIXj59RkX4JJwBiuGvDhVYK5RCvwnfsxsKI3DLP9PCobYDzWXSURNs9_szFcaBSLsl3iuZNZvnAMYY5DNMIpz_ydLqMuDi8wmd5kLZ-cqvtCIa7rP8hSsMVPnycyIaa148Ih6FA52Nb29KcQfDU0WvK2peo0Ih9_5DQ8JD9nH60H8E3SJ75qu7LKPSuW0rIMsuPLaYDOfzvbpoxKN1yDHx-5UiunENbssH8pszBlTdQ';

async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
    });
    return await res.json();
}


const getTopTracks = async (req, res) => {
    const topTracks = (await fetchWebApi(
        'v1/me/top/tracks?time_range=short_term&limit=5', 'GET'
    )).items
    const response = topTracks?.map(
        ({ name, artists }) =>
            `${name} by ${artists.map(artist => artist.name).join(', ')}`
    )

    res.json(response);

}

export default {
    getTopTracks
}
