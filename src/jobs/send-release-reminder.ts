import { AppDataSource } from "../data-source";
import { MovieReminder } from "../entities/movie-reminder.entity";
import { Movie } from "../entities/movie.entity";
import { User } from "../entities/user.entity";
import { sendEmail } from "../services/email.service";

export async function sendReleaseReminders() {
  const today = new Date().toISOString().slice(0, 10);

  const repo = AppDataSource.getRepository(MovieReminder);

  const reminders = await repo.find({
    where: { remindAt: today, sent: false },
    relations: ["movie", "user"],
  });

  for (const reminder of reminders) {
    const movie = reminder.movie as Movie;
    const user = reminder.user as User;

    if (!user?.email) continue;

    await sendEmail({
      to: user.email,
      subject: `Lembrete: estreia de "${movie.title}" hoje!`,
      html: `
        <p>Olá, ${user.name || ""}</p>
        <p>Só passando pra lembrar que o filme <strong>${movie.title}</strong> estreia hoje.</p>
        ${
          movie.synopsis
            ? `<p><em>${movie.synopsis}</em></p>`
            : ""
        }
      `,
    });

    reminder.sent = true;
    await repo.save(reminder);
  }
}
