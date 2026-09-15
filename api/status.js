module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.SELLAUTH_API_KEY || '6151040|OcCgJWN7HCCkz1LCkKJfKbxqSQOunx85BD1jZ55H9b5cc923';
    const shopId = process.env.SELLAUTH_SHOP_ID || '255381';

    const response = await fetch('https://api.sellauth.com/v1/shops/' + shopId + '/products', {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: 'SellAuth API responded with status ' + response.status
      });
    }

    const json = await response.json();
    const rawList = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);

    const products = rawList.map(function(p) {
      return {
        id: p.id,
        name: p.name,
        path: p.path,
        status: p.status_text || 'Undetected',
        color: p.status_color || '#2ecc71',
        stock: p.stock_count !== undefined ? p.stock_count : p.stock
      };
    });

    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    return res.status(200).json({
      success: true,
      shop_id: shopId,
      timestamp: Date.now(),
      products: products
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};
