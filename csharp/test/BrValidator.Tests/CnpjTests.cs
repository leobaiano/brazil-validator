using Xunit;

namespace BrValidator.Tests
{
    public class CnpjTests
    {
        [Theory]
        [InlineData("11.222.333/0001-81")]
        [InlineData("11222333000181")]
        [InlineData("00.777.723/0001-00")]
        [InlineData("00.777.723/1476-23")]
        [InlineData("00.777.723/2476-87")]
        [InlineData("00.777.723/3229-99")]
        [InlineData("00.777.723/4519-69")]
        [InlineData("00.777.723/0751-00")]
        [InlineData("42.755.665/0001-55")]
        [InlineData("42.755.665/7618-65")]
        [InlineData("42.755.665/2428-33")]
        [InlineData("42.755.665/6247-95")]
        [InlineData("42.755.665/7222-90")]
        [InlineData("42.755.665/8166-00")]
        [InlineData("85.333.762/0001-62")]
        [InlineData("85.333.762/1873-00")]
        [InlineData("85.333.762/4083-23")]
        [InlineData("85.333.762/1128-07")]
        [InlineData("85.333.762/2682-11")]
        [InlineData("85.333.762/1336-34")]
        [InlineData("04.769.491/0001-90")]
        [InlineData("57.847.140/0001-17")]
        [InlineData("18.405.334/0001-00")]
        [InlineData("78.598.990/0001-07")]
        [InlineData("98.139.666/0001-20")]
        [InlineData("74.200.778/0001-80")]
        [InlineData("49.941.793/0001-32")]
        public void IsValid_AcceptsNumeric(string value)
        {
            Assert.True(Cnpj.IsValid(value));
        }

        [Theory]
        [InlineData("11.222.333/0001-82")]
        [InlineData("11.111.111/1111-11")]
        [InlineData("1122233300018")]
        [InlineData("11.222.333/@001-81")]
        public void IsValid_RejectsInvalid(string value)
        {
            Assert.False(Cnpj.IsValid(value));
        }

        // Generated with Receita Federal's official simulator:
        // https://servicos.receitafederal.gov.br/servico/cnpj-alfa/simular
        [Theory]
        [InlineData("12.ABC.345/01DE-35")]
        [InlineData("HD.D6E.N85/0001-38")]
        [InlineData("P4.W9Z.N4E/0001-47")]
        [InlineData("VJ.AGE.C9J/0001-46")]
        [InlineData("CJ.TLM.0JM/0001-88")]
        [InlineData("CJ.TLM.0JM/JPPZ-15")]
        [InlineData("CJ.TLM.0JM/1RD1-50")]
        [InlineData("CJ.TLM.0JM/HSWB-47")]
        [InlineData("CJ.TLM.0JM/0P56-99")]
        [InlineData("YG.8DJ.YZK/0001-57")]
        [InlineData("YG.8DJ.YZK/6JW7-66")]
        [InlineData("YG.8DJ.YZK/AX68-35")]
        [InlineData("GG.CBW.BAD/0001-94")]
        [InlineData("GG.CBW.BAD/PWRR-99")]
        [InlineData("GG.CBW.BAD/0K1T-41")]
        [InlineData("GG.CBW.BAD/L1YA-78")]
        [InlineData("GG.CBW.BAD/WLR5-06")]
        public void IsValid_AcceptsAlphanumeric(string value)
        {
            Assert.True(Cnpj.IsValid(value));
        }

        [Fact]
        public void IsValid_RejectsTamperedAlphanumeric()
        {
            Assert.False(Cnpj.IsValid("HD.D6E.N85/0001-39"));
        }

        [Theory]
        [InlineData("11.222.333/0001-81", "11222333000181")]
        [InlineData("11222333000181", "11222333000181")]
        [InlineData("12.ABC.345/01DE-35", "12ABC34501DE35")]
        public void Normalize(string input, string expected)
        {
            Assert.Equal(expected, Cnpj.Normalize(input));
        }

        [Theory]
        [InlineData("11222333000181", "11.222.333/0001-81")]
        [InlineData("11.222.333/0001-81", "11.222.333/0001-81")]
        [InlineData("123", "123")]
        [InlineData("12ABC34501DE35", "12.ABC.345/01DE-35")]
        public void Format(string input, string expected)
        {
            Assert.Equal(expected, Cnpj.Format(input));
        }
    }
}
