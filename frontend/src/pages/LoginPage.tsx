import { useState, type FormEvent } from "react";

type LoginPageProps = {
  email: string;
  password: string;
  error: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const styles = `
  * {
    box-sizing: border-box;
  }

  .ncrtc-login {
    display: grid;
    grid-template-columns: 2fr 1fr;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    margin: 0;
    padding: 0;
    background: #fff;
    color: #10243d;
    font-family: "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif;
    text-align: left;
  }

  .ncrtc-login * {
    box-sizing: border-box;
  }

  .ncrtc-login-brand {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 0;
    min-height: 100vh;
    min-height: 100dvh;
    padding: clamp(40px, 7.5vw, 120px);
    overflow: hidden;
    background: #0b203a;
    color: #fff;
  }

  .ncrtc-login-brand-content {
    width: 100%;
    max-width: 620px;
    margin: 0 auto;
  }

  .ncrtc-login-eyebrow {
    margin: 0 0 22px;
    color: #72d0d3;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: .7px;
  }

  .ncrtc-login-brand h1 {
    margin: 0 0 30px;
    color: #fff;
    font-family: Manrope, sans-serif;
    font-size: clamp(38px, 3.2vw, 54px);
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -1.5px;
  }

  .ncrtc-login-description {
    max-width: 500px;
    margin: 0;
    color: #b7c5d8;
    font-size: 18px;
    line-height: 1.55;
  }

  .ncrtc-login-brand-footer {
    position: absolute;
    bottom: 36px;
    left: clamp(40px, 7.5vw, 120px);
    display: flex;
    align-items: center;
    gap: 10px;
    color: #a6b8ce;
    font-size: 12px;
  }

  .ncrtc-login-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #54c5a0;
  }

 .ncrtc-login-form-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 0;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 55px clamp(28px, 3.2vw, 64px);
  background: #fff;
  position: relative;
}

  .ncrtc-login-form-content {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
  }

  .ncrtc-login-form-content h2 {
    margin: 0 0 30px;
    color: #10243d;
    font-family: Manrope, sans-serif;
    font-size: 27px;
    font-weight: 800;
    letter-spacing: -.6px;
  }

  .ncrtc-login-fields {
    display: flex;
    flex-direction: column;
    gap: 19px;
  }

  .ncrtc-login-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ncrtc-login-field label {
    color: #10243d;
    font-size: 14px;
    font-weight: 700;
  }

  .ncrtc-login-field input {
    width: 100%;
    height: 52px;
    padding: 0 14px;
    border: 1px solid #9aabc1;
    border-radius: 7px;
    outline: none;
    background: #fff;
    color: #10243d;
    font-family: inherit;
    font-size: 14px;
  }

  .ncrtc-login-field input:focus {
    border-color: #117f86;
    box-shadow: 0 0 0 3px rgb(17 127 134 / 13%);
  }

  .ncrtc-login-toggle {
    align-self: flex-start;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #116b78;
    font-family: inherit;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
  }

  .ncrtc-login-toggle:hover {
    text-decoration: underline;
  }

  .ncrtc-login-error {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 13px;
    border-radius: 7px;
    background: #fbdada;
    color: #a51d1d;
    font-size: 13px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .ncrtc-login-submit {
    width: 100%;
    min-height: 53px;
    margin-top: 1px;
    padding: 14px;
    border: 0;
    border-radius: 7px;
    background: #117f86;
    color: #fff;
    font-family: inherit;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    transition: background .18s ease;
  }

  .ncrtc-login-submit:hover:not(:disabled) {
    background: #0d6d74;
  }

  .ncrtc-login-submit:disabled {
    cursor: wait;
    opacity: .7;
  }

 .ncrtc-login-footer {
  position: absolute;
  bottom: 30px;
  left: 24px;
  right: 24px;
  margin: 0;
  padding: 0;
  color: #8996a6;
  font-size: 10px;
  line-height: 1.8;
  text-align: center;
}

  .ncrtc-login-mobile-brand {
    display: none;
  }

  @media (max-width: 760px) {
    .ncrtc-login {
      grid-template-columns: 1fr 1fr;
    }

    .ncrtc-login-brand {
      padding: 32px;
    }

    .ncrtc-login-brand-footer {
      left: 32px;
    }

    .ncrtc-login-form-panel {
      padding: 32px 24px;
    }

    .ncrtc-login-description {
      font-size: 15px;
    }
  }

  @media (max-width: 560px) {
    .ncrtc-login {
      display: block;
    }

    .ncrtc-login-brand {
      display: none;
    }

    .ncrtc-login-form-panel {
      justify-content: center;
      padding: 32px 25px;
    }

    .ncrtc-login-mobile-brand {
      display: flex;
      align-items: center;
      gap: 11px;
      margin-bottom: 45px;
      color: #53677f;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .ncrtc-login-mobile-mark {
      display: grid;
      width: 42px;
      height: 42px;
      place-items: center;
      border-radius: 10px;
      background: #0b203a;
      color: #fff;
      font-size: 23px;
      font-weight: 800;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ncrtc-login-submit {
      transition: none;
    }
  }

    .ncrtc-login-demo {
    margin-top: 20px;
    color: #8996a6;
    font-size: 12px;
    line-height: 1.7;
    text-align: center;
    overflow-wrap: anywhere;
  }

  .ncrtc-login-demo strong {
    color: #52677f;
    font-weight: 700;
  }
`;

export default function LoginPage({
  email,
  password,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <style>{styles}</style>

      <main className="ncrtc-login">
        <section className="ncrtc-login-brand">
          <div className="ncrtc-login-brand-content">
            <p className="ncrtc-login-eyebrow">
              NCRTC · RRTS FEEDER OPERATIONS
            </p>

            <h1>
              Bus Management
              <br />
              System
            </h1>

            <p className="ncrtc-login-description">
              Fleet tracking, duties and incident response for the Delhi-NCR
              feeder network.
            </p>
          </div>

          <div className="ncrtc-login-brand-footer">
            <span className="ncrtc-login-dot" />
            NCRTC · Transit Operations
          </div>
        </section>

        <section className="ncrtc-login-form-panel">
          <div className="ncrtc-login-form-content">
            <div className="ncrtc-login-mobile-brand">
              <span className="ncrtc-login-mobile-mark">N</span>
              NCRTC · TRANSIT CONTROL
            </div>

            <h2>Sign in</h2>

            <form className="ncrtc-login-fields" onSubmit={onSubmit}>
              <div className="ncrtc-login-field">
                <label htmlFor="ncrtc-email">Email</label>
                <input
                  id="ncrtc-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  required
                />
              </div>

              <div className="ncrtc-login-field">
                <label htmlFor="ncrtc-password">Password</label>
                <input
                  id="ncrtc-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  required
                />
              </div>

              <button
                className="ncrtc-login-toggle"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? "Hide password" : "Show password"}
              </button>

              {error && (
                <div className="ncrtc-login-error" role="alert">
                  <span aria-hidden="true">▪</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                className="ncrtc-login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <p className="ncrtc-login-demo">
              Demo credentials: <strong>admin@ncrtc.demo</strong> /{" "}
              <strong>Demo@123</strong>
            </p>
          </div>

          <footer className="ncrtc-login-footer">
            NCRTC Bus Management System · Demonstration environment
          </footer>
        </section>
      </main>
    </>
  );
}
