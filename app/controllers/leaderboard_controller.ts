import type { HttpContext } from "@adonisjs/core/http";
import { User } from "#models/user";

export default class LeaderboardController {
	async index({ view }: HttpContext) {
		const topUsers = await User.query()
			.where("score", ">", 0)
			.orderBy("score", "desc")
			.limit(5);

		return view.render("pages/leaderboard", { topUsers });
	}

	async store({ view }: HttpContext) {
		const topUsers = await User.query()
			.where("score", ">", 0)
			.orderBy("score", "desc")
			.limit(5);

		return view.render("pages/leaderboard", { topUsers });
	}
}
