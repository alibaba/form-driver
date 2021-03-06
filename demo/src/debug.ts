function setCookie(kv:string) {
	const arr = kv.split("=");
	let name = arr[0],value = arr[1],days = 100;
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function injectTestCookie(){
  const c="SSO_LANG_V2=ZH-CN; cna=CziREg1jZSUCATy/FJZb349c; _tb_token_=8OIJRpyOhQrtKjGZnDUo; SSO_EMPID_HASH_V2=edd7878601d4db92a540a27222237a8c; hupan-hom_USER_COOKIE=7E255AAC91830D0B5E1DDCF8F8B92D62D3357245A94B9EDA8A2E24BBAACE31AE3B71DBD185E363365A5A010C58867102A40FC40F17B9C325B47A716365C5978605D3DE21E9547AFD979B6C857C07D9FB1C61B40D1FFAF2196F7451C13A819E7C17ADC8AEC03738301473FA654A0C0889A73E8ABB200DB8167F76CE6CFCF03AD653EBBF117789B04485D6FD20BE2A3C3B2BEABF7DCECCECE6A66E1EC85D28E044D0E96B02883A1E0B4D752E04FCBB468C037A292703EF792CFC5C8A314F57CFDE831E7ED76245A283384CC020EC9F0B024167A9E707A5683C4F150C62E29F15AED45B5B94394833413A7C1AE067CC3CF3583E9B1040238054A9D11598807DBE56803AF0C1A34E66E8628685ABDC4985CB70559175E46ADCAC285FB3FBF1FF52D646EC18D2F23045974EEBA8623A47C51EB9114C693891C679B78BDAC82B8E40D54FB230419540B9E2DFC3E9704CF1852D2619F2AD5C2784BC0FA410E060A3D6C3E00AF9271C75D4AA098C22FE4139BA2805D3DE21E9547AFD979B6C857C07D9FB4DD744614B61609B178A34B5C43D0AD2; XSRF-TOKEN=69a00abe-b7bf-4c87-bb40-dec8c0c27064; JSESSIONID=9DEF65E027D2EB3E092291338FA99AF2; sid=2D5AE37D24D3ACBE3E0A21977E11D86B.hupan-hom100083170048.eu95sqa; hupan-hom_SSO_TOKEN_V2=D5BF62E72D9CFD4CDAD45ACB83AB20CDF4594131F44321BFBCC2B76549B3CB4826F32B0A4CAE5A3A52ED5863B4E658B036CB6A9A54BAAE87A50DA04E009885E8; xlly_s=2; isg=BDg4Ucz8k3KHBv3Vhly6ukeDCeDKoZwr1Y2TJXKp1XMmjdp3GrEvu_DrRYU97lQD"
  c.split(";").forEach(setCookie)
}
