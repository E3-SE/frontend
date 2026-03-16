export function Footer() {
  return (
    <footer className="bg-surface-dim px-6 pb-12 pt-20 lg:px-20">
      <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 font-headline text-2xl font-bold text-primary">
            <img className="" src="/leaf.svg" alt="" />
            ZenMassage
          </span>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Connecting you to the finest wellness sanctuaries. We believe
            tranquility is a necessity, not a luxury.
          </p>
          {/* <div className="flex gap-4">
              <span className="material-symbols-outlined cursor-pointer text-primary">social_leaderboard</span>
              <span className="material-symbols-outlined cursor-pointer text-primary">retweet</span>
            </div> */}
        </div>

        <div>
          <h4 className="mb-6 font-bold text-on-surface">Explore</h4>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            <li>
              <a
                className="transition-colors hover:text-primary"
                href="/massage-shops"
              >
                Massage Shops
              </a>
            </li>
            {/* <li><a className="transition-colors hover:text-primary" href="#">Our Philosophy</a></li> */}
            {/* <li><a className="transition-colors hover:text-primary" href="#">Wellness Blog</a></li> */}
          </ul>
        </div>

        {/* <div>
            <h4 className="mb-6 font-bold text-on-surface">Support</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><a className="transition-colors hover:text-primary" href="#">Contact Us</a></li>
              <li><a className="transition-colors hover:text-primary" href="#">Privacy Policy</a></li>
              <li><a className="transition-colors hover:text-primary" href="#">Terms of Service</a></li>
            </ul>
          </div> */}

        {/* <div>
            <h4 className="mb-6 font-bold text-on-surface">Newsletter</h4>
            <p className="mb-4 text-sm text-on-surface-variant">Stay updated on new sanctuaries.</p>
            <div className="flex flex-col gap-2">
              <input
                className="rounded-lg border-none bg-surface p-3 text-sm focus:ring-1 focus:ring-primary"
                placeholder="Your email"
                type="email"
              />
              <button className="rounded-lg bg-primary py-3 text-sm font-bold text-on-primary">Subscribe</button>
            </div>
          </div> */}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
        <p className="text-xs text-on-surface-variant">© 2026 ZenMassage by Pikiwedia.</p>
        {/* <div className="flex gap-6 text-xs text-on-surface-variant">
            <span>English</span>
            <span>Thai</span>
          </div> */}
      </div>
    </footer>
  );
}