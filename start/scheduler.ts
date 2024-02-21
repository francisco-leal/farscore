import scheduler from "adonisjs-scheduler/services/main";

scheduler.command("sync:farcaster-casts").everyFiveMinutes();
