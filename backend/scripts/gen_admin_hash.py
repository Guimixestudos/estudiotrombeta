"""
Trombeta Admin , Gerador de credenciais para Railway.

Uso (rode LOCALMENTE no seu computador, NUNCA no chat):

    cd backend
    python scripts/gen_admin_hash.py

Vai pedir usuário + senha (a senha não fica visível enquanto digita),
gerar o hash bcrypt e imprimir o bloco pronto para colar nas Variables do Railway.

Suas credenciais NUNCA saem do seu computador.
"""
from __future__ import annotations

import getpass
import secrets
import sys

try:
    import bcrypt
except ImportError:
    print("ERRO: bcrypt não está instalado.")
    print("Rode: pip install bcrypt==4.1.2")
    sys.exit(1)


def main() -> None:
    print("\n" + "=" * 60)
    print(" TROMBETA , GERADOR DE CREDENCIAIS ADMIN ")
    print("=" * 60)

    username = input("\nUsuário admin (ex: guilherme): ").strip()
    if not username or len(username) < 2:
        print("Usuário inválido (mínimo 2 caracteres).")
        sys.exit(1)

    while True:
        password = getpass.getpass("Senha admin (12+ chars recomendado): ")
        if len(password) < 8:
            print("Senha muito curta. Use ao menos 8 caracteres (12+ ideal).")
            continue
        confirm = getpass.getpass("Confirme a senha: ")
        if password != confirm:
            print("Senhas não conferem. Tente de novo.")
            continue
        break

    # Bcrypt hash with cost factor 12 (good balance security/speed)
    salt = bcrypt.gensalt(rounds=12)
    password_hash = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    # JWT secret (sugestão , só usar se ainda não tem um)
    jwt_secret = secrets.token_urlsafe(48)

    print("\n" + "=" * 60)
    print(" COLE ISTO NO RAILWAY (Backend , Variables , Raw Editor) ")
    print("=" * 60 + "\n")

    print(f"ADMIN_USERNAME={username}")
    print(f"ADMIN_PASSWORD_HASH={password_hash}")
    print(f"JWT_SECRET={jwt_secret}")
    print(f"JWT_EXPIRE_HOURS=12")
    print(f"LOGIN_MAX_ATTEMPTS=5")
    print(f"LOGIN_LOCKOUT_MINUTES=15")

    print("\n" + "=" * 60)
    print(" AVISOS IMPORTANTES ")
    print("=" * 60)
    print("""
1. NO RAILWAY USE O 'RAW EDITOR' (Variables , botão 'Raw Editor') e cole
   o bloco completo. Se digitar variável-a-variável, o caractere $ do
   hash bcrypt pode ser interpretado errado.

2. Verifique se o hash foi salvo com TODOS os $ intactos:
   - Vai começar com $2b$12$ seguido de letras/números/símbolos.
   - Se ficou $2b12$ ou similar, ele foi corrompido. Cole de novo.

3. Se você já tem um JWT_SECRET configurado e funcionando, NÃO precisa
   trocar. Trocar invalida todas as sessões já abertas.

4. Após salvar, o Railway vai redeployar automaticamente (uns 30s).
   Aí faça login em https://estudiotrombeta.com/admin .

5. Em caso de erro 'Admin não configurado' DEPOIS de salvar:
   - Confirme que está no environment correto (production, não preview).
   - Veja em Deploy Logs se o serviço reiniciou após salvar.
   - O hash NÃO pode ter aspas em volta no Railway.
""")


if __name__ == "__main__":
    main()
