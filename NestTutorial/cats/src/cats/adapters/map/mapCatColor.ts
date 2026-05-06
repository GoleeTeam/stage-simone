import { CatColor } from "../../domain/cats.color.enum";
import { CatColorInput } from "../../application/input/filterCatColorInput";

export function mapCatColor(color: CatColor): CatColorInput {
    switch (color) {
    case CatColor.WHITE:
      return CatColor.WHITE;

    case CatColor.BLACK:
      return CatColor.BLACK;

    case CatColor.GRAY:
      return CatColor.GRAY;

    case CatColor.ORANGE:
      return CatColor.ORANGE;

    case CatColor.MULTI:
      return CatColor.MULTI;
    }
}
