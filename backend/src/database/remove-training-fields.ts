import { query } from "../config/database.js";

async function removeTrainingFields() {
  console.log("🔄 Removing trainingType and deliveryType columns from trainings table...");

  try {
    // Drop deliveryType column
    try {
      await query(`ALTER TABLE trainings DROP COLUMN deliveryType`);
      console.log("  ✓ Removed 'deliveryType' column from trainings table");
    } catch (error: any) {
      if (error.code === "ER_CANT_DROP_FIELD_OR_KEY") {
        console.log("  ⚠ 'deliveryType' column does not exist in trainings table");
      } else {
        throw error;
      }
    }

    // Drop trainingType column
    try {
      await query(`ALTER TABLE trainings DROP COLUMN trainingType`);
      console.log("  ✓ Removed 'trainingType' column from trainings table");
    } catch (error: any) {
      if (error.code === "ER_CANT_DROP_FIELD_OR_KEY") {
        console.log("  ⚠ 'trainingType' column does not exist in trainings table");
      } else {
        throw error;
      }
    }

    // Drop index if it exists
    try {
      await query(`DROP INDEX idx_trainingType ON trainings`);
      console.log("  ✓ Removed 'idx_trainingType' index from trainings table");
    } catch (error: any) {
      if (error.code === "ER_CANT_DROP_FIELD_OR_KEY") {
        console.log("  ⚠ 'idx_trainingType' index does not exist");
      }
      // Ignore index errors
    }

    console.log("✅ Training fields removal completed successfully!");
  } catch (error) {
    console.error("❌ Removal failed:", error);
    process.exit(1);
  }
}

// Run if called directly
removeTrainingFields()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export default removeTrainingFields;

