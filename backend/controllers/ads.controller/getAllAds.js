import { pool } from "../../db/connectPostgres.js";

const getAllAds = async (req, res) => {
  try {
    const query = `
        SELECT
        a.id,
        a.text,
        a.link,
        a.created_at AS ad_created_at,
        imgf.path AS ad_img
        FROM ads a
        LEFT JOIN files imgf ON a.img_file_id = imgf.id
        ORDER BY a.created_at DESC;
        `;
    const queryResult = await pool.query(query);
    const ads = queryResult.rows.map((ad) => ({
      id: ad.id,
      text: ad.text,
      link: ad.link,
      adImg: ad.ad_img ? `${process.env.SERVER_URL}/${ad.ad_img}` : null,
      createdAt: ad.ad_created_at,
    }));

    res.status(200).json(ads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getAllAds;
