import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unque: true },
  },
  { timestamps: true }
);

const handleSlugUpdate = function (next) {
  if (this._update.name) {
    this._update.slug = slugify(this._update.name, { lower: true });
  }
  next();
};

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});
categorySchema.pre("findOneAndUpdate", handleSlugUpdate);
categorySchema.pre("updateMany", handleSlugUpdate);
categorySchema.pre("update", handleSlugUpdate);
categorySchema.pre("updateOne", handleSlugUpdate);

const Category = mongoose.model("Category", categorySchema);
export default Category;
