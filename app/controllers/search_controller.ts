import type { HttpContext } from "@adonisjs/core/http";
import { User } from "#models/user";

export default class SearchController {
	async index({ view, request }: HttpContext) {
		if (request.parsedUrl.query?.includes("keyword")) {
			const keyword = request.parsedUrl.query.split("=")[1];
			const user = await User.query().where("username", keyword).first();

			if (!user) {
				return view.render("pages/error");
			}

			return view.render("pages/score", { score: user.score, fid: user.fid });
		}

		return view.render("pages/search");
	}
}
