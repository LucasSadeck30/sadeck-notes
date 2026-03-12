import React, { Fragment, useState, useEffect } from "react";
import { Button, Field, Control, Input, Column, Label, Help } from "rbx";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../components/services/api";

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pegar token da URL
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid reset link");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar senhas
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/users/resetPassword", {
        token: token,
        newPassword: newPassword
      });
      
      setSuccess(true);
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to reset password. Token may be expired.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Fragment>
        <Column.Group centered>
          <Column size={12}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Help color="success" style={{ fontSize: '16px', marginBottom: '10px' }}>
                ✅ Password Reset Successful!
              </Help>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Redirecting to login...
              </p>
              <Link 
                to="/login" 
                style={{ color: '#6B5CE7', marginTop: '15px', display: 'inline-block' }}
              >
                Click here if not redirected
              </Link>
            </div>
          </Column>
        </Column.Group>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Column.Group centered>
        <form onSubmit={handleSubmit}>
          <Column size={12}>
            
            <Field>
              <Label size="small">New Password:</Label>
              <Control>
                <Input 
                  as="input"
                  type="password" 
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                />
              </Control>
            </Field>

            <Field>
              <Label size="small">Confirm Password:</Label>
              <Control>
                <Input 
                  as="input"
                  type="password" 
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                />
              </Control>
            </Field>

            <Field>
              <Control>
                <Column.Group>
                  <Column size={12}>
                    <Button 
                      as="button"
                      color="custom-purple" 
                      outlined
                      fullwidth
                      type="submit"
                      disabled={loading || !token}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </Column>
                </Column.Group>
              </Control>
            </Field>

            {/* Link para voltar ao login */}
            <Field>
              <Control>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Link 
                    to="/login"
                    style={{ color: '#6B5CE7', fontSize: '14px' }}
                  >
                    ← Back to Login
                  </Link>
                </div>
              </Control>
            </Field>

            {error && <Help color="danger">❌ {error}</Help>}
            
          </Column>
        </form>
      </Column.Group>
    </Fragment>
  );
}

export default ResetPasswordForm;