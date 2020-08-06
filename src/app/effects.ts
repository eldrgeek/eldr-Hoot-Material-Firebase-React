// import page from 'page';
//update effects
export const storage = {
  saveLocal(key: string, data: { [id: string]: any }) {
    localStorage.setItem(key, JSON.stringify(data));
  },
  getLocal(key: string): { [id: string]: any } {
    return JSON.parse(localStorage.getItem(key) || '{}');
  },
  saveSession(key: string, data: { [id: string]: any }) {
    sessionStorage.setItem(key, JSON.stringify(data));
  },
  getSession(key: string): { [id: string]: any } {
    return JSON.parse(sessionStorage.getItem(key) || '{}');
  },
};

// export const router = {
//   initialize(routes: { [url: string]: (params: object) => void }) {
//     Object.keys(routes).forEach(url => {
//       page(url, ({ params }) => routes[url](params));
//     });
//     page.start();
//   },
//   goTo(url: string) {
//     page.show(url);
//   },
// };

export const ids = {
  create(): string {
    return Date.now().toString();
  },
};
