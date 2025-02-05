import { pool } from "../../db/connectPostgres.js";

const deletAd = async (req, res) => {
  try {
    const adId = req.params.id;

    const adQuery = `
    SELECT * FROM ads WHERE id = $1
    `;

    const adResult = await pool.query(adQuery, [adId]);

    const ads = adResult.rows[0];

    if (!ads) {
      return res.status(404).json({
        message: "Ad not found",
      });
    }

    const deleteQuery = `
    DELETE FROM ads WHERE id = $1
    `;
    await pool.query(deleteQuery, [adId]);

    res.status(200).json({
      message: "Ad deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default deletAd;
